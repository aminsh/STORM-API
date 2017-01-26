"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    JournalLineQuery = require('../queries/query.journalLine');

router.route('/journal/:journalId')
    .get(async((req, res) => {
        let journalLineQuery = new JournalLineQuery(req.cookies['branch-id']),
            result = await(journalLineQuery.getAll(req.params.journalId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let journalRepository = new JournalRepository(req.cookies['branch-id']),
            journalLineRepository = new JournalLineRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.article))
            errors.push(translate('The Article is required'));

        if (cmd.article.length < 3)
            errors.push(translate('The Article should have at least 3 character'));

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let entity = {
            journalId: cmd.journalId,
            generalLedgerAccountId: cmd.generalLedgerAccountId,
            subsidiaryLedgerAccountId: cmd.subsidiaryLedgerAccountId,
            detailAccountId: cmd.detailAccountId,
            dimension1Id: cmd.dimension1Id,
            dimension2Id: cmd.dimension2Id,
            dimension3Id: cmd.dimension3Id,
            description: cmd.description,
            debtor: cmd.balanceType == 'debtor' ? cmd.amount : 0,
            creditor: cmd.balanceType == 'creditor' ? cmd.amount : 0
        };

        entity = await(journalLineRepository.create(entity));
        await(journalRepository.checkIsComplete(cmd.journalId));

        return res.json({
            isValid: true,
            returnValue: { id: entity.id }
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let journalLineQuery = new JournalLineQuery(req.cookies['branch-id']),
            result = await(journalLineQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let journalLineRepository = new JournalLineRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.article))
            errors.push(translate('The Article is required'));

        if (cmd.article.length < 3)
            errors.push(translate('The Article should have at least 3 character'));

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let entity = await(journalLineRepository.findById(cmd.id));

        entity.subsidiaryLedgerAccountId = cmd.subsidiaryLedgerAccountId;
        entity.detailAccountId = cmd.detailAccountId;
        entity.dimension1Id = cmd.dimension1Id;
        entity.dimension2Id = cmd.dimension2Id;
        entity.dimension3Id = cmd.dimension3Id;
        entity.article = cmd.article;
        entity.debtor = cmd.balanceType == 'debtor' ? cmd.amount : 0;
        entity.creditor = cmd.balanceType == 'creditor' ? cmd.amount : 0;

        await(journalLineRepository.update(entity));

        return res.json({ isValid: true });
    }))
    .delete(async((req, res) => {
        let journalRepository = new JournalRepository(req.cookies['branch-id']),
            journalLineRepository = new JournalLineRepository(req.cookies['branch-id']),
            errors = [];

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(journalLineRepository.remove(req.params.id));
        await(journalRepository.checkIsComplete(cmd.journalId));

        return res.json({ isValid: true });
    }));

module.exports = router;