"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Journal = require('../domain/journal'),
    JournalRepository = require('../data/repository.journal'),
    InvoiceRepository = require('../data/repository.invoice'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-purchase-created', async((cmd, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),
        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),

        purchase = await(invoiceRepository.findById(cmd.purchaseId)),
        result = await(journalDomain.generateForPurchase(purchase));

    let id = await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(
        async(() => await(invoiceRepository.update(purchase.id, {journalId: id}))),
        1000);
}));
