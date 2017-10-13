"use strict";

const  async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    SettingsRepository = require('../data/repository.setting');


class SubLedger {
    constructor(branchId) {
        this.subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);

        const settingsRepository = new SettingsRepository(branchId),
            subsidiaryLedgerAccounts = await(settingsRepository.get()).subsidiaryLedgerAccounts;

        this.subLedger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item=> item.id);
    }

    getById(id) {
        return this.subsidiaryLedgerAccountRepository.findById(id);
    }

    receivableAccount() {
        return this.getById(this.subLedger.businessDebtors);
    }

    payableAccount() {
        return this.subLedger.businessCreditors;
    }

    saleAccount() {
        return this.subLedger.saleGood;
    }

    saleDiscountAccount() {
        return this.subLedger.saleDiscountGood;
    }

    saleVatAccount() {
        return this.subLedger.saleTax;
    }

    purchaseAccount() {
        return this.subLedger.inventory;
    }

    purchaseDiscountAccount() {
        return this.subLedger.purchaseDiscountGood;
    }

    purchaseVatAccount() {
        return this.subLedger.purchaseTax;
    }

    fundAccount() {
        return this.subLedger.fund;
    }

    bankAccount() {
        return this.subLedger.bank;
    }

    receivableDocument() {
        return this.subLedger.businessNotesReceivables;
    }

    payableDocument() {
        return this.subLedger.businessNotesPayables;
    }
};

module.exports = SubLedger;