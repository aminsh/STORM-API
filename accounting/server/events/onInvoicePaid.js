"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InvoiceRepository = require('../data/repository.invoice'),
    PaymentRepository = require('../data/repository.payment'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-invoice-paid', async((invoiceId, branchId) => {
    let invoiceRepository = new InvoiceRepository(branchId),
        paymentRepository = new PaymentRepository(branchId),

        invoice = await(invoiceRepository.findById(invoiceId)),
        sumPayments = await(paymentRepository.getBySumAmountByInvoiceId(invoiceId)).sum || 0,

        totalPrice = invoice.invoiceLines.asEnumerable()
            .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

    console.log(sumPayments);
    console.log(totalPrice);

    if (sumPayments >= totalPrice)
        await(invoiceRepository.update(invoiceId, {invoiceStatus: 'paid'}));
}));