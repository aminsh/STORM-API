"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    PaymentRepository = require('../data/repository.payment'),
    Journal = require('../domain/journal'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-receive-created', async((payments, invoiceId, current) => {
    let journalRepository = new JournalRepository(current.branchId),
        paymentRepository = new PaymentRepository(current.branchId),

        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateReceivablePayment(payments, invoiceId));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(async(() => result.payments.forEach(p =>
        await(paymentRepository.update(p.id, {journalLineId: p.journalLineId}))
    )), 1000);
}));


EventEmitter.on('on-pay-created', async((payments, invoiceId, current) => {
    let journalRepository = new JournalRepository(current.branchId),
        paymentRepository = new PaymentRepository(current.branchId),

        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generatePayablePayment(payments, invoiceId));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(async(() => result.payments.forEach(p =>
        await(paymentRepository.update(p.id, {journalLineId: p.journalLineId}))
    )), 1000);
}));