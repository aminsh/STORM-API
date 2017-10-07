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
        return this.subsidiaryLedgerAccountRepository.findByCode('2101');
    }

    saleAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('6101');
    }

    saleDiscountAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('8305');
    }

    saleVatAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('2106');
    }

    purchaseAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('5101');
    }

    purchaseDiscountAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('7203');
    }

    purchaseVatAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('1111');
    }

    fundAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('1101');
    }

    bankAccount() {
        return this.subsidiaryLedgerAccountRepository.findByCode('1103');
    }

    receivableDocument() {
        return this.subsidiaryLedgerAccountRepository.findByCode('1105');
    }

    payableDocument() {
        return this.subsidiaryLedgerAccountRepository.findByCode('2102');
    }
};

module.exports = SubLedger;