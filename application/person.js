"use strict";

const DetailAccountService = require('./detailAccount'),
    String = instanceOf('utility').String,
    SettingsRepository = require('./data').SettingsRepository;

class Bank {
    constructor(branchId) {
        this.branchId = branchId;
        this.detailAccountService = new DetailAccountService(branchId);
    }

    create(cmd){
        cmd.detailAccountType = 'person';

        return this.detailAccountService.create(cmd);
    }

    update(id , cmd){
        this.detailAccountService.update(id, cmd);
    }

    remove(id){
        let errors = [],
            settings = new SettingsRepository(this.branchId).get();

        if(settings.bankId === id)
            errors.push('حساب بانکی جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if(errors.length > 0)
            throw new ValidationException(errors);

        this.detailAccountService.remove(id);
    }
}

module.exports = Bank;