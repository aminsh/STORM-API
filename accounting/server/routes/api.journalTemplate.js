"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    JournalTemplateRepository = require('../data/repository.journalTemplate'),
    JournalTemplateQuery = require('../queries/query.journalTemplate'),
    persianDateService = require('../services/persianDateService');

router.route('/')
    .get(async((req, res) => {
        let journalTemplateQuery = new JournalTemplateQuery(req.branchId),
            result = await(journalTemplateQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let journalTemplateRepository = new JournalTemplateRepository(req.branchId),
            cmd = req.body,

            entity = {
                title: cmd.title,
                journalId: cmd.journalId
            };

        await(journalTemplateRepository.create(entity));

        res.json({
            isValid: true,
            returnValue: entity.id
        });
    }));

router.route('/:id/copy')
    .post(async((req, res) => {
        let journalRepository = new JournalRepository(req.branchId),
            journalLineRepository = new JournalLineRepository(req.branchId),
            journalTemplateRepository = new JournalTemplateRepository(req.branchId),
            id = req.params.id,
            fiscalPeriodId = req.fiscalPeriodId,
            template = await(journalTemplateRepository.findById(id)),
            journal = await(journalRepository.findById(template.journalId)),
            journalLines = await(journalLineRepository.findByJournalId(journal.id)),

            newJournal = {
                periodId: fiscalPeriodId,
                createdById: req.user.id,
                journalStatus: 'Temporary',
                journalType: journal.journalType,
                tagId: journal.tagId,
                description: journal.description,
                temporaryNumber: (await(journalRepository.maxTemporaryNumber(fiscalPeriodId)).max || 0) + 1,
                temporaryDate: persianDateService.current()
            },

            newJournalLines = journalLines.asEnumerable()
                .select(line => ({
                    article: line.article,
                    generalLedgerAccountId: line.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: line.subsidiaryLedgerAccountId,
                    detailAccountId: line.detailAccountId,
                    dimension1Id: line.dimension1Id,
                    dimension2Id: line.dimension2Id,
                    dimension3Id: line.dimension3Id,
                    debtor: line.debtor,
                    creditor: line.creditor
                })).toArray();

        await(journalRepository.batchCreate(newJournalLines, newJournal));

        res.json({
            isValid: true,
            returnValue: {id: newJournal.id}
        });
    }));

router.route('/:id')
    .delete(async((req, res) => {
        let journalTemplateRepository = new JournalTemplateRepository(req.branchId);
        await(journalTemplateRepository.remove(req.params.id));
        res.json({isValid: true});
    }));

module.exports = router;
