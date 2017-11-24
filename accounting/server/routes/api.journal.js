"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    JournalQuery = require('../queries/query.journal');

router.route('/')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getAll(req.cookies['current-period'], req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        try {
            const id = RunService("journalCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/total-info').get((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getTotalInfo(req.cookies['current-period']));

    res.json(result);
});

router.route('/max-number').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getMaxNumber(req.cookies['current-period']));
    res.json(result);
}));

router.route('/:id')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.batchFindById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService("journalUpdate", [req.params.id, req.body], req);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("journalRemove", [req.params.id], req);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id/confirm')
    .put(async((req, res) => {
        try {
            RunService("journalFix", [req.params.id], req);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/by-number/:number').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getByNumber(
            req.cookies['current-period'],
            req.params.number));

    res.json(result);
}));

router.route('/summary/grouped-by-month').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getGroupedByMouth(req.cookies['current-period']));
    res.json(result);
}));

router.route('/month/:month').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getJournalsByMonth(
            req.params.month,
            req.cookies['current-period'],
            req.query));
    res.json(result);
}));

router.route('/period/:periodId').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.branchId),
        result = await(journalQuery.getAllByPeriod(req.cookies['current-period'], req.query));
    res.json(result);
}));

router.route('/:id/bookkeeping').put(async((req, res) => {
    try {
        RunService("journalBookkeeping", [req.params.id], req);
        res.json({isValid: true});

    }
    catch (e) {
        res.json({isValid: false, errors: e.errors});
    }

}));

router.route('/:id/attach-image').put(async((req, res) => {

    try {

        RunService("journalAttachImage", [req.params.id, req.body.fileName], req);
        res.json({isValid: true});
    }
    catch (e) {
        res.json({isValid: false, errors: e.errors});
    }
}));

router.route('/:id/copy').post(async((req, res) => {

    try {

        const id = RunService("journalCopy", [req.params.id], req);
        res.json({isValid: true, returnValue: {id}});
    }
    catch (e) {
        res.json({isValid: false, errors: e.errors});
    }
}));

router.route('/:detailAccountId/payable-transactions/not-have-cheque')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getPayablesNotHaveChequeLines(
                req.cookies['current-period'],
                req.params.detailAccountId, req.query));

        res.json(result);
    }));

module.exports = router;


