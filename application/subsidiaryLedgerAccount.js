"use strict";

const SubsidiaryLedgerAccountRepository = require('./data').SubsidiaryLedgerAccountRepository,
    GeneralLedgerAccountRepository = require('./data').GenenralLedgerAccountRepository,
    SettingsRepository = require('./data').SettingsRepository,
    String = instanceOf('utility').String;

class SubsidiaryLedgerAccountService {
    
    constructor(branchId){
        this.branchId = branchId;
        
        this.subsidiaryLedgerAccountRepsitory = new SubsidiaryLedgerAccountRepository(branchId);

        const settings = this.settings = new SettingsRepository(branchId).get();

        this.defaultAccounts = (settings.subsidiaryLedgerAccounts || [])
            .asEnumerable()
            .toObject(item => item.key, item => item.id);
    }

    get receivableAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['businessDebtors']);
    }

    get payableAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['businessCreditors']);
    }

    get saleAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['saleGood']);
    }

    get saleDiscountAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['saleDiscountGood']);
    }

    get saleVatAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['saleTax']);
    }

    get purchaseAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['inventory']);
    }

    get purchaseDiscountAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['purchaseDiscountGood']);
    }

    get purchaseVatAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['purchaseTax']);
    }

    get fundAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['fund']);
    }

    get bankAccount() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['bank']);
    }

    get receivableDocument() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['businessNotesReceivables']);
    }

    get payableDocument() {
        return this.subsidiaryLedgerAccountRepsitory.findById(this.defaultAccounts['businessNotesPayables']);
    }

    create(generalLedgerAccountId, cmd) {
        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.code))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.subsidiaryLedgerAccountRepsitory.findByCode(cmd.code))
            errors.push('کد تکراری است');

        if(!new GeneralLedgerAccountRepository(this.branchId).findById(generalLedgerAccountId))
            errors.push('حساب کل انتخاب شده وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            generalLedgerAccountId: generalLedgerAccountId,
            code: cmd.code,
            title: cmd.title,
            isBankAccount: cmd.isBankAccount,
            balanceType: cmd.balanceType,
            hasDetailAccount: cmd.hasDetailAccount,
            hasDimension1: cmd.hasDimension1,
            hasDimension2: cmd.hasDimension2,
            hasDimension3: cmd.hasDimension3
        };

        this.subsidiaryLedgerAccountRepsitory.create(entity);

        return entity.id;
    }

    update(id, cmd) {
        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.code))
            errors.push('کد نمیتواند خالی باشد');
        else if (this.subsidiaryLedgerAccountRepsitory.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            code: cmd.code,
            isBankAccount: cmd.isBankAccount,
            balanceType: cmd.balanceType,
            hasDetailAccount: cmd.hasDetailAccount,
            hasDimension1: cmd.hasDimension1,
            hasDimension2: cmd.hasDimension2,
            hasDimension3: cmd.hasDimension3
        };

        this.subsidiaryLedgerAccountRepsitory.update(id, entity);
    }

    remove(id) {
        let errors = [];

       if(this.subsidiaryLedgerAccountRepsitory.isUsedOnJournalLines(id))
           errors.push('حساب معین جاری در اسناد حسابداری استفاده شده ، امکان حذف وجود ندارد');

       if((this.settings.subsidiaryLedgerAccounts || []).asEnumerable().any(item => item.id === id))
           errors.push('حساب معین جاری در تنظیمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.subsidiaryLedgerAccountRepsitory.remove(id);
    }
}

module.exports = SubsidiaryLedgerAccountService;