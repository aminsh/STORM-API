"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalGenerationTemplateService = require('../../journalGenerationTemplateService'),
    JournalRepository = require('../../../data/repository.journal'),
    InvoiceRepository = require('../../../data/repository.invoice');

class CreateJournalOnSale {

    constructor(state, command) {
        this.fiscalPeriodId = state.fiscalPeriodId;

        this.journalRepository = new JournalRepository(state.branchId);
        this.invoiceRepository = new InvoiceRepository(state.branchId);
        this.journalGenerationTemplateService = new JournalGenerationTemplateService(state.branchId, state.fiscalPeriodId);

        this.command = command;
    }

    run() {
        let cmd = this.command,

            sale = await(this.invoiceRepository.findById(cmd.id)),

            model = {
                number: sale.number,
                date: sale.date,
                title: sale.title,
                amount: sale.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: sale.invoiceLines.asEnumerable().sum(line => line.discount),
                vat: sale.invoiceLines.asEnumerable().sum(line => line.vat),
                customer: sale.detailAccountId
            },

            journal = await(this.journalGenerationTemplateService.set(model, 'sale'));

        const lines = journal.lines;

        delete journal.lines;

        await(this.journalRepository.batchCreate(lines, journal));
    }

}

module.exports = CreateJournalOnSale;