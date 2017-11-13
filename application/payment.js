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
    }

    setInvoice(id, invoiceId){
        this.paymentRepository.update(id, {invoiceId});
    }

    setJournal(id, journalId){
        this.paymentRepository.update(id, {journalId});
    }
}

module.exports = PaymentService;
