import {injectable, inject} from "inversify";
import md5 from "md5";

@injectable()
export class UserService {

    @inject("UserRepository")
    /** @type {UserRepository}*/ userRepository = undefined;

    @inject("VerificationService")
    /** @type{VerificationService} */ verificationService = undefined;

    @inject("UserOauthProfileRepository")
    /**@type{UserOauthProfileRepository}*/ userOauthProfileRepository = undefined;

    @inject("SmsService")
    /** @type{SmsService}*/ smsService = undefined;

    @inject("State") context = undefined;

    changeSet = [];

    login(dto) {

        if (!(dto.email || dto.mobile))
            throw new ValidationSingleException('موبایل یا ایمیل وارد نشده');

        if (!dto.password)
            throw new ValidationSingleException('کلمه عبور وارد نشده');

        let user;

        if (dto.email)
            user = this.userRepository.findByEmailAndPassword(dto.email, md5(dto.password));

        if (dto.mobile)
            user = this.userRepository.findOne({state: 'active', mobile: dto.mobile, password: md5(dto.password)});

        if (!user)
            throw new ValidationSingleException('{0} یا کلمه عبور صحیح نیست'.format(dto.email ? 'ایمیل' : 'موبایل'));

        return user.id;
    }

    register(dto) {

        if (!(dto.email || dto.mobile))
            throw new ValidationSingleException('موبایل یا ایمیل وارد نشده');

        if (!dto.password)
            throw new ValidationSingleException('کلمه عبور وارد نشده');

        if (dto.email) {
            let isDuplicatedEmail = this.userRepository.isDuplicatedEmail(dto.email);

            if (isDuplicatedEmail)
                throw new ValidationSingleException('ایمیل تکراری است');
        }

        if (dto.mobile) {
            let isDuplicatedMobile = this.userRepository.isDuplicatedMobile(dto.mobile);

            if (isDuplicatedMobile)
                throw new ValidationSingleException('موبایل تکراری است');
        }

        let user = {
            id: Utility.TokenGenerator.generate128Bit(),
            email: dto.email,
            mobile: dto.mobile,
            name: dto.name,
            password: md5(dto.password.toString()),
            state: 'pending',
            token: Utility.TokenGenerator.generate256Bit()
        };

        this.userRepository.create(user);

        let result;

        if (user.mobile)
            result = this.sendMobileVerification(user);

        return Object.assign({id: user.id}, result);
    }

    update(dto) {

        let id = this.context.user.id,
            user = this.userRepository.findOne({id}),
            entity = {};

        Object.keys(dto)
            .filter(key => Object.keys(user).includes(key))
            .forEach(key => this._checkIsChange(key, dto, user));

        if (this.changeSet.length === 0)
            return;

        this.changeSet.forEach(item => entity[item.fieldName] = item.newValue);

        this.userRepository.update(id, entity);

        if (this.changeSet.asEnumerable().any(item => item.fieldName === 'mobile'))
            try {
                this.sendMobileVerification({id: user.id, mobile: entity.mobile});
            }
            catch (e) {

            }
    }

    sendMobileVerification(user) {

        try {
            this.verificationService.send(user.mobile, {userId: user.id});

            return {duration: 60000};
        }
        catch (e) {
            if (e instanceof ValidationException && e.errors[0] === 'This number is in queue')
                throw new ValidationSingleException('پیامک ارسال شده ، لطفا یک دقیقه دیگر تلاش کنید');
        }
    }

    registerByGoogle(token, profile) {

        let userProfile = this.userOauthProfileRepository.getByProviderAndProfileId('google', profile.id);

        let user = userProfile
            ? this.userRepository.findOne({id: userProfile.userId})
            : this.userRepository.findByEmailOrMobile({email: profile.emails[0].value});

        if (user) {
            !user.isActiveEmail && this.userRepository.update(user.id, {isActiveEmail: true});

            this._createOrUpdateUserProfile('google', userProfile, token, profile, user.id);

            return user.id;
        }

        user = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            state: 'pending',
            isActiveEmail: true,
            token: Utility.TokenGenerator.generate256Bit()
        };

        this.userRepository.create(user);

        Utility.delay(500);

        this._createOrUpdateUserProfile('google', userProfile, token, profile, user.id);

        return user.id;
    }

    registerByTinet(token, profile) {

        let userProfile = this.userOauthProfileRepository.getByProviderAndProfileId('tinet', profile.user_id);

        let user = userProfile
            ? this.userRepository.findOne({id: userProfile.userId})
            : this.userRepository.findByEmailOrMobile({email: profile.email, mobile: profile.phone_number});

        if (user) {

            if (!user.isActiveEmail && profile.email_verified)
                user.isActiveEmail = true;

            if (!user.isActiveMobile && profile.phone_number_verified)
                user.isActiveMobile = true;

            this.userRepository.update(user.id, user);

            this._createOrUpdateUserProfile('tinet', userProfile, token, profile, user.id);

            return user.id;
        }

        user = {
            id: Utility.TokenGenerator.generate128Bit(),
            name: profile.name,
            email: profile.email,
            mobile: profile.phone_number,
            state: profile.phone_number_verified ? 'active' : 'pending',
            isActiveEmail: !!profile.email_verified,
            isActiveMobile: !!profile.phone_number_verified,
            token: Utility.TokenGenerator.generate256Bit()
        };

        this.userRepository.create(user);

        Utility.delay(500);

        this._createOrUpdateUserProfile('tinet', userProfile, token, profile, user.id);

        return user.id;
    }

    _createOrUpdateUserProfile(provider, userProfile, token, profile, userId) {

        if (userProfile) {

            userProfile.token = token;
            userProfile.userId = userId;
            userProfile.profile = profile;

            this.userOauthProfileRepository.update(userProfile.id, userProfile);

            return;
        }

        userProfile = {
            provider,
            provider_user_id: provider === 'google' ? profile.id : profile.user_id,
            token,
            profile,
            userId
        };

        this.userOauthProfileRepository.create(userProfile);
    }

    regenerateToken() {

        this.userRepository.update(this.context.user.id, {token: Utility.TokenGenerator.generate256Bit()});
    }

    mobileEntry(mobile) {

        let user = Object.assign({}, this.context.user);

        user.mobile = mobile || user.mobile;

        if (!user.mobile)
            throw new ValidationSingleException('موبایل وارد نشده');

        return this.sendMobileVerification(user);
    }

    verifyMobile(code) {

        let result = this.verificationService.verify(code);

        this.userRepository.update(result.data.userId, {mobile: result.mobile, isActiveMobile: true, state: 'active'});

        return result.data.userId;
    }

    changePassword(password) {

        if (!password)
            throw new ValidationSingleException('کلمه عبور وجود ندارد');

        this.userRepository.update(this.context.user.id, {password: md5(password)});
    }

    changeImage(image) {

        if (!image)
            throw new ValidationSingleException('تصویر وجود ندارد');

        this.userRepository.update(this.context.user.id, {image});
    }

    resetPasswordByMobile(mobile) {

        let newPassword = randomPassword(),
            user = this.userRepository.findOne({mobile});

        if (!user)
            throw new ValidationSingleException('موبایل وجود ندارد');

        let customFields = user.custom_fields || {};

        customFields.shouldChangePassword = true;

        this.userRepository.update(user.id, {password: md5(newPassword), custom_fields: customFields});

        this.smsService.resetPassword(mobile, newPassword);
    }

    _checkIsChange(fieldName, DTO, user) {

        const isUndefined = Utility.isUndefined;

        if (isUndefined(DTO[fieldName]))
            return;

        if (DTO[fieldName] === user[fieldName])
            return;

        let newValue = DTO[fieldName];

        if (fieldName === 'password')
            newValue = md5(newValue);

        if (fieldName === 'email')
            this.changeSet.push({fieldName: 'isActiveEmail', newValue: false});

        if (fieldName === 'mobile') {

            this.changeSet.push({fieldName: 'isActiveMobile', newValue: false});
        }


        this.changeSet.push({fieldName, newValue});
    }

}

function randomPassword() {
    let text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}