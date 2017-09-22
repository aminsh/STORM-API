"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    _ = require('lodash'),
    JournalRepository = require('../../../data/repository.journal'),
    JournalLineRepository = require('../../../data/repository.journalLine'),
    InvoiceRepository = require('../../../data/repository.invoice'),
    JournalGenerationTemplateRepository = require('../../../data/repository.journalGenerationTemplate'),

    SubLedgerDomain = require('../../subledger');

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

class CreateJournalOnSale {

    constructor(state, command) {
        this.fiscalPeriodId = state.fiscalPeriodId;

        this.journalRepository = new JournalRepository(state.branchId);
        this.journalLineRepositroy = new JournalLineRepository(state.branchId);
        this.invoiceRepository = new InvoiceRepository(state.branchId);
        this.journalGenerationTemplateRepository = new JournalGenerationTemplateRepository(state.branchId);

        this.subLedger = new SubLedgerDomain(state.branchId);

        this.command = command;
    }

    run() {
        let cmd = this.command,
            journal = await(this.getJournal(cmd.date)),

            saleGenerationTemplate = await(this.journalGenerationTemplateRepository.findBySourceType('sale')).data,

            invoiceLines = cmd.invoiceLines,

            model = {
                number: cmd.number,
                date: cmd.date,
                title: cmd.title,
                amount: invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoiceLines.asEnumerable().sum(line => line.discount),
                vat: invoiceLines.asEnumerable().sum(line => line.vat),
                customer: cmd.detailAccountId
            };

        journal = Object.assign(journal, saleGenerationTemplate);

        journal.description = this.render(journal.description, model);

        journal.lines = journal.lines.asEnumerable()
            .select(item => ({
                subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                detailAccountId: this.render(item.detailAccountId, model),
                article: this.render(item.article, model),
                debtor: parseInt(this.render(item.debtor, model)),
                creditor: parseInt(this.render(item.creditor, model))
            }))
            .where(item => (item.debtor + item.creditor) !== 0)

            .orderByDescending(item => item.debtor)

            .toArray();


        journal.lines.forEach(async.result((e, i) => {
            e.row = i + 1;
            e.generalLedgerAccountId = await(this.subLedger.getById(e.subsidiaryLedgerAccountId))
                .generalLedgerAccountId
        }));

        const lines = journal.lines;

        delete journal.lines;

        await(this.journalRepository.batchCreate(lines, journal));
    }

    getJournal(date) {
        let maxNumber = await(this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId)).max || 0;

        return {
            periodId: this.fiscalPeriodId,
            journalStatus: 'Fixed',
            temporaryNumber: ++maxNumber,
            temporaryDate: date,
            isInComplete: false
        };
    }

    render(template, model) {
        return _.template(template)(model);
    }
}

module.exports = CreateJournalOnSale;