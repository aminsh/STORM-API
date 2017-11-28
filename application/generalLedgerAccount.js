"use strict";

const GeneralLedgerAccountRepository = require('./data').GenenralLedgerAccountRepository;

class GeneralLedgerAccount {
    constructor(branchId) {
        this.branchId = branchId;
        this.generalLedgerAccountRepository = new GeneralLedgerAccountRepository(branchId);
    }

    create(cmd) {
        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.title))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.generalLedgerAccountRepository.findByCode(cmd.code))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            groupingType: cmd.groupingType
        };

        this.generalLedgerAccountRepository.create(entity);
    }

    update(id, cmd) {
        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.title))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.generalLedgerAccountRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            id,
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            groupingType: cmd.groupingType
        };

        this.generalLedgerAccountRepository.update(entity);
    }

    remove(id) {
        let errors = [];

        let generalLedgerAccount = this.generalLedgerAccountRepository.findById(id);

        if (generalLedgerAccount.subsidiaryLedgerAccounts && generalLedgerAccount.subsidiaryLedgerAccounts.length > 0)
            errors.push('حساب کل جاری دارای معین میباشد ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.generalLedgerAccountRepository.remove(id);
    }
}

module.exports = GeneralLedgerAccount;