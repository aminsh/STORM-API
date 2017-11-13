"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    _ = require('lodash'),
    String = instanceOf('utility').String,

    JournalGenerationTemplateRepository = require('./data').JournalGenerationTemplateRepository;

_.templateSettings.interpolate = /#([\s\S]+?)#/g;

class JournalService {
    constructor(branchId) {

        this.journalGenerationTemplateRepository = new JournalGenerationTemplateRepository(branchId);
    }

    generate(cmd, sourceType){

        let generationTemplate = this.journalGenerationTemplateRepository.findBySourceType(sourceType);

        if(!generationTemplate)
            throw new ValidationException(['الگوی ساخت سند حسابداری وجود ندارد']);

        generationTemplate = generationTemplate.data;

        let journal = {
            description: this._render(generationTemplate.description, cmd),
            journalLines: generationTemplate.lines.asEnumerable()
                .select(item => ({
                    subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                    detailAccountId: this._render(item.detailAccountId, cmd) || null,
                    article: this._render(item.article, cmd),
                    debtor: parseInt(this._render(item.debtor, cmd)),
                    creditor: parseInt(this._render(item.creditor, cmd))
                }))
                .where(item => (item.debtor + item.creditor) !== 0)

                .orderByDescending(item => item.debtor)

                .toArray()
        };

        return journal;
    }



    _render(template, model) {
        return _.template(template)(model);
    }
}

module.exports = JournalService;