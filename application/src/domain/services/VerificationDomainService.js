import {inject, injectable} from "inversify";

@injectable()
export class VerificationDomainService {

    /** @type {VerificationRepository}*/
    @inject("VerificationRepository") verificationRepository = undefined;

    @inject("SmsService")
    smsService = undefined;

    send(mobile, data) {

        let code = this._getCode(),
            entity = {mobile, data, code};

        this.verificationRepository.create(entity);

        this.smsService.send(mobile, 'استورم - کد فعاسازی {0}'.format(code));

        setTimeout(()=> this.verificationRepository.remove(entity.id), 300000);
    }

    verify(code) {
        let item = this.verificationRepository.findByCode(parseInt(code));

        if (!item)
            throw new ValidationException(['کد فعالسازی صحیح نیست']);

        this.verificationRepository.remove(item.id);

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