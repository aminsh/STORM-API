import {injectable, inject} from "inversify";
import md5 from "md5";

const Enums = instanceOf('Enums'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class UserService {

    @inject("UserRepository")
    /** @type {UserRepository}*/ userRepository = undefined;

    @inject("VerificationDomainService")
    /** @type{VerificationDomainService} */ verificationDomainService = undefined;

    @inject("SmsService")
    /** @type{SmsService}*/ smsService = undefined;

    @inject("Context") context = undefined;

    login(dto) {

        if (!(dto.email || dto.mobile))
            throw new ValidationException(['موبایل یا ایمیل وارد نشده']);

        if (!dto.password)
            throw new ValidationException(['کلمه عبور وارد نشده']);

        let user;

        if (dto.email)
            user = this.userRepository.findByEmailAndPassword(dto.email, md5(dto.password));

        if (dto.mobile)
            user = this.userRepository.findOne({state: 'active', mobile: dto.mobile, password: md5(dto.password)});

        if (!user)
            throw new ValidationException(['{0} یا کلمه عبور صحیح نیست'.format(dto.email ? 'ایمیل' : 'موبایل')]);

        return user.id;
    }

    register(dto) {

        if (!(dto.email || dto.mobile))
            throw new ValidationException(['موبایل یا ایمیل وارد نشده']);

        if (!dto.password)
            throw new ValidationException(['کلمه عبور وارد نشده']);

        if (dto.email) {
            let isDuplicatedEmail = this.userRepository.isDuplicatedEmail(dto.email);

            if (isDuplicatedEmail)
                throw new ValidationException(['ایمیل تکراری است']);
        }

        if (dto.mobile) {
            let isDuplicatedMobile = this.userRepository.isDuplicatedMobile(dto.mobile);

            if (isDuplicatedMobile)
                throw new ValidationException(['موبایل تکراری است']);
        }

        let user = {
            id: TokenGenerator.generate128Bit(),
            email: dto.email,
            mobile: dto.mobile,
            name: dto.name,
            password: md5(dto.password.toString()),
            state: 'pending',
            token: TokenGenerator.generate256Bit()
        };

        this.userRepository.create(user);

        let result;

        if (user.mobile)
            result = this.sendMobileVerification(user);

        return Object.assign({id: user.id}, result);
    }

    sendMobileVerification(user) {

        try {
            this.verificationDomainService.send(user.mobile, {userId: user.id});

            return {duration: 60000};
        }
        catch (e) {
            if (e instanceof ValidationException && e.errors[0] === 'This number is in queue')
                throw new ValidationException(['پیامک ارسال شده ، لطفا یک دقیقه دیگر تلاش کنید']);
        }
    }

    registerByGoogle(googleToken, profile) {

        let user = this.userRepository.findOne({id: profile.id});

        if (user && !user.isActiveEmail) {
            this.userRepository.update(user.id, {isActiveEmail: true});
            return user.id;
        }

        user = {
            id: profile.id,
            googleToken,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            state: 'pending',
            isActiveEmail: true,
            token: TokenGenerator.generate256Bit()
        };

        this.userRepository.create(user);

        return user.id;
    }

    regenerateToken() {

        this.userRepository.update(this.context.user.id, {token: TokenGenerator.generate256Bit()});
    }

    mobileEntry(mobile) {

        let user = Object.assign({}, this.context.user);

        user.mobile = mobile || user.mobile;

        if (!user.mobile)
            throw new ValidationException(['موبایل وارد نشده']);

        return this.sendMobileVerification(user);
    }

    verifyMobile(code) {

        let result = this.verificationDomainService.verify(code);

        this.userRepository.update(result.data.userId, {mobile: result.mobile, isActiveMobile: true, state: 'active'});

        return result.data.userId;
    }

    changePassword(password) {

        this.userRepository.update(this.context.user.id, {password: md5(password)});
    }

    resetPasswordByMobile(mobile) {

        let newPassword = randomPassword(),
            user = this.userRepository.findOne({mobile});

        if (!user)
            throw new ValidationException(['موبایل وجود ندارد']);

        let customFields = user.custom_fields || {};

        customFields.shouldChangePassword = true;

        this.userRepository.update(user.id, {password: newPassword, custom_fields: customFields});

        this.smsService.resetPassword(mobile, newPassword);
    }

}

function randomPassword() {
    let text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}