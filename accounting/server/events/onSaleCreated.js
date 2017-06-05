"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalService = require('../routes/service.journal'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, current) => {
    let journalService = new JournalService(
        current.branchId,
        current.fiscalPeriodId,
        current.userId);

    journalService.createBySaleNotPaid(sale);
}));
