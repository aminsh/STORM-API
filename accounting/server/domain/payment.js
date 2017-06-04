"use strict";

const PaymentRepository = require('../data/repository.payment');

module.exports = class Payment {
    constructor(branchId) {
        this.branchId = branchId;
    }

    create(invoiceId, list) {
        this.payments = list.asEnumerable().select(item => {
            if (item.type == 'cheque')
                item = this.createCheque(item);
            else if (item.type == 'receipt')
                item = this.createReceipt(item);
            else if (item.type == 'cash')
                item = this.createCash(item);

            item.invoiceId = invoiceId;
            return item;
        }).toArray();
    }

    createCheque(cmd) {

    }

    createReceipt(cmd) {

    }

    createCash(cmd) {

    }

    save() {
        let paymentRepository = new PaymentRepository(this.branchId);
        return paymentRepository.create(this.payments);
    }

    generateJournal() {

    }
};