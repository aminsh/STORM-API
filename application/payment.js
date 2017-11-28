"use strict";

const PaymentRepository = require('./data').PaymentRepository;

class PaymentService {

    constructor(branchId) {
        this.branchId = branchId;
        this.paymentRepository = new PaymentRepository(branchId);
    }

    create(paymentDTO, receiveOrPay) {
        let payments = paymentDTO.asEnumerable()
            .select(item => ({
                number: item.number,
                date: item.date,
                amount: item.amount,
                paymentType: item.paymentType,
                bankName: item.bankName,
                bankBranch: item.bankBranch,
                receiveOrPay,
                chequeStatus: item.paymentType === 'cheque' ? 'normal' : null
            }))
            .toArray();

        this.paymentRepository.create(payments);

        return payments.asEnumerable()
            .select(item => item.id)
            .toArray();
    }

    setInvoiceForAll(paymentIds, invoiceId) {
        paymentIds.forEach(id => this.setInvoice(id, invoiceId));
    }

    setInvoice(id, invoiceId) {
        this.paymentRepository.update(id, {invoiceId});
    }

    setJournalLineForAll(payments) {
        payments.forEach(item => this.setJournalLine(item.id, item.journalLineId))
    }

    setJournalLine(id, journalLineId) {
        this.paymentRepository.update(id, {journalLineId});
    }
}

module.exports = PaymentService;
