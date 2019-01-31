import { Injectable } from "src/Infrastructure/DependencyInjection";
import { UserRepository } from "./user.repository";
import { UserLoginDTO, UserRegisterDTO, UserUpdateDTO } from "./user.dto";
import { User, UserState } from "./user.entity";
import * as md5 from 'md5'
import { BadRequestException } from "src/Infrastructure/Exceptions";
import { ILike } from "../Infrastructure/Database/FindOperators";
import { TokenGenerator } from "../Infrastructure/Utility";
import { getCurrentContext } from "src/Infrastructure/ApplicationCycle";
import { OauthProviders, UserProfile } from "./userProfile.entity";
import { SMSService } from "../Notification/SMS.service";
import { VerificationService } from "../Verification/verification.service";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository,
                private readonly smsService: SMSService,
                private readonly verificationService: VerificationService) { }

    async login(dto: UserLoginDTO): Promise<string> {
        let user: User;

        if (dto.mobile)
            user = await this.userRepository.findOne({ mobile: dto.mobile, password: md5(dto.password) });

        if (dto.email)
            user = await this.userRepository.findOne({ email: dto.email, password: md5(dto.password) });

        if (!user)
            throw new BadRequestException(`یا کلمه عبور صحیح نیست ${ dto.email ? 'ایمیل' : 'موبایل' }`);

        return user.id;
    }

    async register(dto: UserRegisterDTO): Promise<any> {
        if (dto.email) {
            const isDuplicatedEmail = await this.userRepository.findOne({ email: ILike(dto.email) });

            if (isDuplicatedEmail)
                throw new BadRequestException('ایمیل تکراری است')
        }

        if (dto.mobile) {
            const isDuplicatedMobile = await this.userRepository.findOne({ mobile: dto.mobile });

            if (isDuplicatedMobile)
                throw new BadRequestException('موبایل تکراری است');
        }

        let user = new User();

        user.id = TokenGenerator.generate128Bit();
        user.email = dto.email;
        user.mobile = dto.mobile;
        user.name = dto.name;
        user.state = UserState.PENDING;
        user.token = TokenGenerator.generate256Bit();

        await this.userRepository.save(user);

        let result;

        if (user.mobile)
            result = this.sendMobileVerification(user);

        return { id: user.id, ...result };
    }

    async update(dto: UserUpdateDTO): Promise<any> {
        const context = getCurrentContext();

        let user = await this.userRepository.findOne({ id: context.user.id });

        user.name = dto.name;

        let mobileChanged: boolean = false,
            emailChanged: boolean = false;

        if (user.mobile !== dto.mobile) {
            mobileChanged = true;
            user.isActiveMobile = false;
        }

        if (user.email.toLocaleLowerCase() !== dto.email.toLocaleLowerCase()) {
            emailChanged = true;
            user.isActiveEmail = false;
        }


        user.mobile = dto.mobile;
        user.email = dto.email;

        await this.userRepository.save(user);

        if (mobileChanged)
            await this.sendMobileVerification(user);
    }

    async registerByGoogle(token: string, profile: any): Promise<any> {

        let userProfile = await this.userRepository.findProfile(OauthProviders.GOOGLE, profile.id);

        let user = userProfile
            ? await userProfile.user
            : await this.userRepository.findOne({ email: profile.emails[ 0 ].value });

        if (user) {

            user.isActiveEmail = true;

            let userProfile = user.profiles.filter(item => item.provider === OauthProviders.GOOGLE)[ 0 ];

            if (!userProfile) {
                userProfile = new UserProfile();

                user.profiles.push(userProfile);
            }

            userProfile.provider = OauthProviders.GOOGLE;
            userProfile.providerUserId = profile.id;
            userProfile.token = token;
            userProfile.profile = profile;

            await this.userRepository.save(user);

            return user.id;
        }

        user = new User;
        user.id = profile.id;
        user.name = profile.displayName;
        user.email = profile.emails[ 0 ].value;
        user.image = profile.photos[ 0 ].value;
        user.image = UserState.PENDING;
        user.isActiveEmail = true;
        user.token = TokenGenerator.generate256Bit();

        userProfile = new UserProfile;
        userProfile.provider = OauthProviders.GOOGLE;
        userProfile.providerUserId = profile.id;
        userProfile.token = token;
        userProfile.profile = profile;

        user.profiles.push(userProfile);

        await this.userRepository.save(user);

        return user.id;
    }

    async registerByTinet(token: string, profile: any) {

        let userProfile = await this.userRepository.findProfile(OauthProviders.GOOGLE, profile.id);

        let user = userProfile
            ? await userProfile.user
            : await this.userRepository.findByEmailOrMobile(profile.email, profile.phone_number);

        if (user) {

            if (profile.email_verified)
                user.isActiveEmail = true;

            if (profile.phone_number_verified)
                user.isActiveMobile = true;

            if (!userProfile) {
                userProfile = new UserProfile();

                user.profiles.push(userProfile);
            }

            userProfile.provider = OauthProviders.TINET;
            userProfile.providerUserId = profile.user_id;
            userProfile.token = token;
            userProfile.profile = profile;

            await this.userRepository.save(user);

            return user.id;
        }

        user = new User;
        user.id = TokenGenerator.generate128Bit();
        user.name = profile.name;
        user.email = profile.email;
        user.mobile = profile.phone_number;
        user.state = profile.phone_number_verified ? UserState.ACTIVE : UserState.PENDING;
        user.isActiveEmail = !!profile.email_verified;
        user.isActiveMobile = !!profile.phone_number_verified;
        user.token = TokenGenerator.generate256Bit();

        userProfile = new UserProfile;
        userProfile.provider = OauthProviders.TINET;
        userProfile.providerUserId = profile.user_id;
        userProfile.token = token;
        userProfile.profile = profile;

        await this.userRepository.save(user);

        return user.id;
    }

    async regenerateToken(): Promise<void> {
        const context = getCurrentContext();

        let user = await this.userRepository.findOne({ id: context.user.id });
        user.token = TokenGenerator.generate256Bit();

        await this.userRepository.save(user);
    }

    async mobileEntry(mobile: string): Promise<any> {
        const context = getCurrentContext();

        let user = await this.userRepository.findOne({ id: context.user.id });
        user.mobile = mobile || user.mobile;

        if (!user.mobile)
            throw new BadRequestException('موبایل وارد نشده');

        return await this.sendMobileVerification(user);
    }

    async verifyMobile(code): Promise<string> {

        let result = await this.verificationService.verify(code);

        let user = await this.userRepository.findOne({ id: result.data.userId });
        user.mobile = result.mobile;
        user.isActiveMobile = true;
        user.state = UserState.ACTIVE;

        await this.userRepository.save(user);

        return user.id;
    }

    async changePassword(password: string): Promise<void> {
        const context = getCurrentContext();

        if(!password)
        throw new BadRequestException('کلمه عبور وجود ندارد');
        let user = await this.userRepository.findOne({ id: context.user.id });
        user.password = md5(password);

        await this.userRepository.save(user);
    }

    async changeImage(image: string) {
        const context = getCurrentContext();

        if (!image)
            throw new BadRequestException('تصویر وجود ندارد');

        let user = await this.userRepository.findOne({ id: context.user.id });

        user.image = image;

        await this.userRepository.save(user);
    }

    async resetPasswordByMobile(mobile: string): Promise<void> {

        let newPassword = this.randomPassword(),
            user = await this.userRepository.findOne({ mobile });

        if (!user)
            throw new BadRequestException('موبایل وجود ندارد');

        user.password = md5(newPassword);
        user.customFields.shouldChangePassword = true;

        await this.userRepository.save(user);

        this.smsService.resetPassword(mobile, newPassword);
    }

    private async sendMobileVerification(user: User): Promise<{ duration: number }> {
        try {
            await this.verificationService.send(user.mobile, { userId: user.id });
            return { duration: 60000 };
        }
        catch (e) {
            if(e instanceof BadRequestException && e.message === 'This number is in queue')
                throw new BadRequestException('پیامک ارسال شده ، لطفا یک دقیقه دیگر تلاش کنید');
        }

    }

    private randomPassword(): string {
        let text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0 ; i < 8 ; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}