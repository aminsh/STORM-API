"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalRepository = require('../data/repository.journal'),
    JournalTemplateRepository = require('../data/repository.journalTemplate'),
    JournalTemplateQuery = require('../queries/query.journalTemplate'),
    persianDateService = require('../services/persianDateService');

router.route('/').get(async((req, res) => {
    let journalTemplateQuery = new JournalTemplateQuery(req.cookies['branch-id']),
        result = journalTemplateQuery.getAll(req.query);
    res.json(result);
}));

router.route('/journal/:journalId').post(async((req, res) => {
    let journalTemplateRepository = new JournalTemplateRepository(req.cookies['branch-id']),
        journalRepository = new JournalRepository(req.cookies['branch-id']),
        journalId = req.params.journalId,
        cmd = req.body,
        journal = await(journalRepository.findById(journalId)),
        data = {
            description: journal.description,
            journalLines: journal.journalLines.asEnumerable()
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
                })).toArray()
        };

    let entity = {
        title: cmd.title,
        data: JSON.stringify(data)
    };

    entity = await(journalTemplateRepository.create(entity));

    res.json({
        isValid: true,
        returnValue: entity.id
    });
}));

router.route('/:id/journal/create').post(async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        journalTemplateRepository = new JournalTemplateRepository(req.cookies['branch-id']),
        id = req.params.id,
        periodId = req.cookies['current-period'],
        template = await(journalTemplateRepository.findById(id)),
        newJournal = JSON.parse(template.data);

    newJournal.periodId = periodId;
    newJournal.createdById = req.user.id;
    newJournal.journalStatus = 'Temporary';
    newJournal.temporaryNumber = (await(journalRepository.maxTemporaryNumber(periodId)) || 0) + 1;
    newJournal.temporaryDate = persianDateService.current();

    newJournal = await(journalRepository.create(newJournal));

    res.json({
        isValid: true,
        returnValue: {id: newJournal.id}
    });
}));

router.route('/journal-templates/:id').delete(async((req, res) => {
    let journalTemplateRepository = new JournalTemplateRepository(req.cookies['branch-id']);
    await(journalTemplateRepository.remove(req.params.id));
    res.json({isValid: true});
}));

module.exports = router;
