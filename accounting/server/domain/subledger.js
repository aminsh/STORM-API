"use strict";

const SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount');


module.exports = class SubLedger {
    constructor(branchId){
        this.subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);
    }

    receivableAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1104');
    }

    payableAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('2101');
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

    purchaseAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('5101');
    }

    purchaseDiscountAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('7203');
    }

    purchaseVatAccount(){
        return this.subsidiaryLedgerAccountRepository.findByCode('1111');
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

    payableDocument(){
        return this.subsidiaryLedgerAccountRepository.findByCode('2102');
    }
};