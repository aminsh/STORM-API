"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-sale-created', async((sale, branchId) => {
    let journalRepository = new JournalRepository(branchId);

}));
