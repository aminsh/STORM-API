"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Journal = require('../domain/journal'),
    JournalRepository = require('../data/repository.journal'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-output-created', async((outputId, current) => {

    const journalRepository = new JournalRepository(current.branchId),
        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateOutputFromSale(outputId));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

}));

EventEmitter.on('on-inputReturnSale-created', async((inputId, current) => {

    const journalRepository = new JournalRepository(current.branchId),
        journalDomain = new Journal(current.branchId, current.fiscalPeriodId),
        result = await(journalDomain.generateForInputReturnSale(inputId));

    await(journalRepository.batchCreate(result.journalLines, result.journal));

}));
