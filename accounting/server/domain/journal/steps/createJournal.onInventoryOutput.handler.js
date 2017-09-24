"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    _ = require('lodash'),
    JournalRepository = require('../../../data/repository.journal'),
    InventoryRepository = require('../../../data/repository.inventory'),
    JournalGenerationTemplateService = require('../journalGenerationTemplateService');

class CreateJournalOnSale {

    constructor(state, command) {
        this.fiscalPeriodId = state.fiscalPeriodId;

        this.journalRepository = new JournalRepository(state.branchId);
        this.invoiceRepository = new InventoryRepository(state.branchId);

        this.journalGenerationTemplateService = new JournalGenerationTemplateService(state.branchId, state.fiscalPeriodId);

        this.command = command;
    }

    run() {
        let cmd = this.command,

            output = await(this.invoiceRepository.findById(cmd.id)),

            model = {
                number: output.number,
                date: output.date,
                amount: output.inventoryLines.asEnumerable().sum(line => line.unitPrice * line.quantity)
            },

            journal = await(this.journalGenerationTemplateService.set(model, 'inventoryOutputSale'));

        const lines = journal.lines;

        delete journal.lines;

        await(this.journalRepository.batchCreate(lines, journal));
    }
}

module.exports = CreateJournalOnSale;