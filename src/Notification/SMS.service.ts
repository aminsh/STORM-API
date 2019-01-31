import { Injectable } from "../Infrastructure/DependencyInjection";
import { Kavenegar } from "../Integration/SMS/Kavenegar/Kavenegar";
import { Configuration } from "../Config/Configuration";

@Injectable()
export class SMSService {
    constructor(private readonly kavenegar: Kavenegar,
                private readonly config: Configuration) { }

    send(receptor: string, message: string): void {
        const apiKey = this.config.KAVENEGAR_API_KEY,
            sender = this.config.KAVENEGAR_SENDER;

        this.kavenegar.send(apiKey, sender, receptor, message);
    }

    sendVerification(receptor: string, code: string): void {
        const apiKey = this.config.KAVENEGAR_API_KEY;

        this.kavenegar.verifyLookup(apiKey, receptor, code, 'smsVerify');
    }

    resetPassword(receptor: string, password: string): void {
        const apiKey = this.config.KAVENEGAR_API_KEY;

        this.kavenegar.verifyLookup(apiKey, receptor, password, 'resetPassword');
    }
}