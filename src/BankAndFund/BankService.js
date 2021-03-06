import {inject, injectable} from "inversify";

@injectable()
export class BankService {

    /**@type {DetailAccountService}*/
    @inject("DetailAccountService") detailAccountService = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    create(cmd) {
        cmd.detailAccountType = 'bank';

        return this.detailAccountService.create(cmd);
    }

    update(id, cmd) {
        this.detailAccountService.update(id, cmd);
    }

    remove(id) {
        let errors = [],
            settings = this.settingsRepository.get();

        if (settings.bankId === id)
            errors.push('حساب بانکی جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.detailAccountService.remove(id);
    }
}

