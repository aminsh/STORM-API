"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Journal = require('../domain/journal'),
    JournalRepository = require('../data/repository.journal'),
    InvoiceRepository = require('../data/repository.invoice'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),
        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateForSale(sale));

    let id = await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(
        async(() => await(invoiceRepository.update(sale.id, {journalId: id}))),
        1000);
}));

EventEmitter.on('on-returnSale-created', async((returnSale, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        invoiceRepository = new InvoiceRepository(current.branchId),
        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateForReturnSale(returnSale));

    let id = await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(
        async(() => await(invoiceRepository.update(returnSale.id, {journalId: id}))),
        1000);
}));

