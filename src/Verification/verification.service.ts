import { Injectable } from "../Infrastructure/DependencyInjection";
import { VerificationRepository } from "./verification.repository";
import { BadRequestException } from "../Infrastructure/Exceptions";
import { Verification } from "./verification.entity";
import { SMSService } from "../Notification/SMS.service";

@Injectable()
export class VerificationService {
    constructor(private readonly verificationRepository: VerificationRepository,
                private readonly smsService: SMSService) { }

    async send(mobile: string, data: any): Promise<void> {
        const numberIsInQueue = await this.verificationRepository.findOne({ mobile });

        if (numberIsInQueue)
            throw new BadRequestException('this number is in queue');

        const code = await this.getCode();

        let entity = new Verification();

        entity.code = code;
        entity.mobile = mobile;
        entity.data = data;

        await this.verificationRepository.save(entity);

        this.smsService.sendVerification(mobile, code);

        setTimeout(async () => {
            await this.verificationRepository.remove(entity);
            console.log(`verification code => ${ code } removed after 60000 ms`);
        }, 60000);
    }

    async verify(code: number): Promise<{ mobile: string, data: any }> {
        let entity = await this.verificationRepository.findOne({ code });

        if (!entity)
            throw new BadRequestException([ 'کد فعالسازی صحیح نیست' ]);

        await this.verificationRepository.remove(entity);

        return { mobile: entity.mobile, data: entity.data };
    }

    private async getCode() {
        let isDuplicated: boolean = true,
            code;

        while (isDuplicated) {
            code = VerificationService.getRandomInt();
            isDuplicated = !!(await this.verificationRepository.findOne({ code }));
        }

        return code;
    }

    static getRandomInt(): number {
        let min = Math.ceil(100000),
            max = Math.floor(999999);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}