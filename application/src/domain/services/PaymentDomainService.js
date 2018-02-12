import {inject, injectable} from "inversify";

@injectable()
export class PaymentDomainService {

    /**@type {PaymentRepository}*/
    @inject("PaymentRepository") paymentRepository = undefined;

    create(paymentDTO, receiveOrPay) {

        let payment = {
            number: paymentDTO.number,
            date: paymentDTO.date,
            amount: paymentDTO.amount,
            paymentType: paymentDTO.paymentType,
            bankName: paymentDTO.bankName,
            bankBranch: paymentDTO.bankBranch,
            receiveOrPay,
            chequeStatus: paymentDTO.paymentType === 'cheque' ? 'normal' : null
        };

        this.paymentRepository.create(payment);

        return payment.id;
    }

    createMany(paymentsDTO, receiveOrPay) {

        return paymentsDTO.asEnumerable()
            .select(p => this.create(p, receiveOrPay))
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
