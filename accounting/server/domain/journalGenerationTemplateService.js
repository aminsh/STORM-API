"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    _ = require('lodash'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    JournalGenerationTemplateRepository = require('../data/repository.journalGenerationTemplate'),
    JournalRepository = require('../data/repository.journal'),
    SubLedgerDomain = require('./subledger');

_.templateSettings.interpolate = /#([\s\S]+?)#/g;


class JournalGenerationTemplateService {

    constructor(branchId, fiscalPeriodId) {
        this.journalGenerationTemplateRepository = new JournalGenerationTemplateRepository(branchId);
        this.journalRepository = new JournalRepository(branchId);

        this.subLedger = new SubLedgerDomain(branchId);

        this.fiscalPeriodId = fiscalPeriodId;
    }

    set(model, sourceType) {
        const generationTemplate = await(this.journalGenerationTemplateRepository.findBySourceType(sourceType))
            .data;

        let journal = await(this.getJournal());

        journal = Object.assign(journal, generationTemplate);

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
                .generalLedgerAccountId;

            e.detailAccountId = String.isNullOrEmpty(e.detailAccountId) ? null : e.detailAccountId;
        }));

        return journal;
    }

    getJournal() {
        let maxNumber = await(this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId)).max || 0;

        return {
            periodId: this.fiscalPeriodId,
            journalStatus: 'Fixed',
            temporaryNumber: ++maxNumber,
            temporaryDate: PersianDate.current(),
            isInComplete: false
        };
    }

    render(template, model) {
        return _.template(template)(model);
    }
}

module.exports = JournalGenerationTemplateService;