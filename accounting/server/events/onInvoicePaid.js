"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory'),
    PaymentRepository = require('../data/repository.payment'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-invoice-paid', async((invoiceId, branchId) => {
    let inventoryRepository = new InventoryRepository(branchId),
        paymentRepository = new PaymentRepository(branchId),

        invoice = await(inventoryRepository.findById(invoiceId)),
        sumPayments = await(paymentRepository.getBySumAmountByInvoiceId(invoiceId)).sum || 0,

        totalPrice = invoice.invoiceLines.asEnumerable()
            .sum(e => (e.unitPrice * e.quantity) - e.discount + e.vat);

    if (sumPayments >= totalPrice)
        inventoryRepository.update(invoiceId, {invoiceStatus: 'paid'});
}));