"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    PaymentRepository = require('../data/repository.payment'),
    Journal = require('../domain/journal'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-payable-cheque-return', async((paymentId, command, current) => {
    let journalRepository = new JournalRepository(current.branchId),
        paymentRepository = new PaymentRepository(current.branchId),

        payment = await(paymentRepository.findById(paymentId)),

        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateReturnPayableCheque(payment, command));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

}));