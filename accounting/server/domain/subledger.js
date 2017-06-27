"use strict";

const SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount');


module.exports = class SubLedger {
    constructor(branchId){
        this.subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);
    }

    receivableAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1104');
    }

    saleAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('6101');
    }

    saleDiscountAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('8305');
    }

    saleVatAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('2106');
    }

    fundAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1101');
    }

    bankAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1103');
    }

    receivableDocument(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1105');
    }
};