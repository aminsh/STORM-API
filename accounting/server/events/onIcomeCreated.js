"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Journal = require('../domain/journal'),
    JournalRepository = require('../data/repository.journal'),
    PaymentRepository = require('../data/repository.payment'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-income-created', async((payments,command, current) => {

    let journalRepository = new JournalRepository(current.branchId),
        paymentRepository = new PaymentRepository(current.branchId),

        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateIncome(payments, command));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

    setTimeout(async(() => result.payments.forEach(p =>
        await(paymentRepository.update(p.id, {journalLineId: p.journalLineId}))
    )), 1000);
}));
