"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ChequeRepository = require('../data/repository.cheque'),
    ChequeQuery = require('../queries/query.cheque');

router.route('/category/:categoryId')
    .get(async((req, res) => {
        let chequeQuery = new ChequeQuery(req.cookies['branch-id']),
            result = await(chequeQuery.getChequesByCategory(req.params.categoryId, req.query));
        res.json(result);
    }));

router.route('/category/:categoryId/whites').get(async((req, res) => {
    let chequeQuery = new ChequeQuery(req.cookies['branch-id']),
        result = await(chequeQuery.getWhiteCheques(req.params.categoryId));
    res.json(result);
}));

router.route('/cheques/used/all').get(async((req, res) => {
    let chequeQuery = new ChequeQuery(req.cookies['branch-id']),
        result = await(chequeQuery.getUsedCheques(req.query));
    res.json(result);
}));

router.route('/:id').get(async((req, res) => {
    let chequeQuery = new ChequeQuery(req.cookies['branch-id']),
        result = await(chequeQuery.getById(req.params.id));
    res.json(result);
}));

router.route('/:id/write').put(async((req, res) => {
    let chequeRepository = new ChequeRepository(req.cookies['branch-id']),
        errors = [],
        cmd = req.body;

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    let entity = await(chequeRepository.findById(req.params.id));

    entity.date = cmd.date;
    entity.amount = cmd.amount;
    entity.description = cmd.description;
    entity.status = 'Used';
    entity.journalLineId = cmd.journalLineId;

    await(chequeRepository.update(entity));

    return res.json({ isValid: true });
}));

module.exports = router;