"use strict";

const SubsidiaryLedgerAccountRepository = require('./data').SubsidiaryLedgerAccountRepository,
    SettingsRepository = require('./data').SettingsRepository;

class SubsidiaryLedgerAccountService {
    
    constructor(branchId){
        this.branchId = branchId;
        
        this.subsidiaryLedgerAccountRepsitory = new SubsidiaryLedgerAccountRepository(branchId);

        const settings = new SettingsRepository(branchId).get();

        this.defaultAccounts = settings.subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item=> item.id);
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
}

module.exports = SubsidiaryLedgerAccountService;