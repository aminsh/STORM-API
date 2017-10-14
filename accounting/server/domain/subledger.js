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
        return this.getById(this.subLedger.businessCreditors);
    }

    saleAccount() {
        return this.getById(this.subLedger.saleGood);
    }

    saleDiscountAccount() {
        return this.getById(this.subLedger.saleDiscountGood);
    }

    saleVatAccount() {
        return this.getById(this.subLedger.saleTax);
    }

    purchaseAccount() {
        return this.getById(this.subLedger.inventory);
    }

    purchaseDiscountAccount() {
        return this.getById(this.subLedger.purchaseDiscountGood);
    }

    purchaseVatAccount() {
        return this.getById(this.subLedger.purchaseTax);
    }

    fundAccount() {
        return this.getById(this.subLedger.fund);
    }

    bankAccount() {
        return this.getById(this.subLedger.bank);
    }

    receivableDocument() {
        return this.getById(this.subLedger.businessNotesReceivables);
    }

    payableDocument() {
        return this.getById(this.subLedger.businessNotesPayables);
    }
};

module.exports = SubLedger;