import {inject, injectable} from "inversify";
import async from "asyncawait/async";

@injectable()
export class VerificationService {

    /** @type {VerificationRepository}*/
    @inject("VerificationRepository") verificationRepository = undefined;

    @inject("SmsService")
    smsService = undefined;

    send(mobile, data) {

        if(this.verificationRepository.findByMobile(mobile))
            throw new ValidationException(['This number is in queue']);

        let code = this._getCode(),
            entity = {mobile, data, code};

        this.verificationRepository.create(entity);

        this.smsService.sendVerification(mobile, code);

        setTimeout(()=>
            this.verificationRepository.remove(entity.id).then(()=> console.log(`verification code => ${code} removed after 60000 ms`)),
            60000);
    }

    verify(code) {
        let item = this.verificationRepository.findByCode(parseInt(code));

        if (!item)
            throw new ValidationException(['کد فعالسازی صحیح نیست']);

        this.verificationRepository.remove(item.id);

        setTimeout(()=> this.verificationRepository.remove(item.id).then(()=> console.log(`verification code => ${code} removed after confirmed `)));

        return {mobile: item.mobile, data: item.data};
    }


    _getCode() {
        let isDuplicated = true,
            code;

        while (isDuplicated) {
            code = this._getRandomInt(),

                isDuplicated = this.verificationRepository.findByCode(code);
        }

        return code;
    }

    _getRandomInt() {
        let min = Math.ceil(100000),
            max = Math.floor(999999);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}