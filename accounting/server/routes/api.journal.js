"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalQuery = require('../queries/query.journal'),
    JournalLineQuery = require('../queries/query.journalLine');

router.route('/')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getAll(req.fiscalPeriodId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        try {
            const id = req.container.get("CommandBus").send("journalCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/total-info')
    .get((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getTotalInfo(req.fiscalPeriodId));
        res.json(result);
    });

router.route('/max-number')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getMaxNumber(req.fiscalPeriodId));
        res.json(result);
    }));

router.route('/ordering-number-by-date')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalOrderingTemporaryNumberByTemporaryDate", []);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.batchFindById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalUpdate", [req.params.id, req.body]);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalRemove", [req.params.id]);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));


router.route('/:id/confirm')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalFix", [req.params.id]);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id/change-date')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalChangeDate", [req.params.id, req.body.date]);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/by-number/:number')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getByNumber(
                req.fiscalPeriodId,
                req.params.number));

        res.json(result);
    }));

router.route('/summary/grouped-by-month')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getGroupedByMouth(req.fiscalPeriodId));
        res.json(result);
    }));

router.route('/month/:month')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getJournalsByMonth(
                req.params.month,
                req.fiscalPeriodId,
                req.query));
        res.json(result);
    }));

router.route('/period/:periodId')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getAllByPeriod(req.fiscalPeriodId, req.query));
        res.json(result);
    }));

router.route('/:id/bookkeeping')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("journalBookkeeping", [req.params.id]);
            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id/attach-image')
    .put(async((req, res) => {
        try {

            req.container.get("CommandBus").send("journalAttachImage", [req.params.id, req.body.fileName]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id/copy')
    .post(async((req, res) => {
        try {

            const id = req.container.get("CommandBus").send("journalCopy", [req.params.id]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:detailAccountId/payable-transactions/not-have-cheque')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId, req.user.id),
            result = await(journalQuery.getPayablesNotHaveChequeLines(
                req.fiscalPeriodId,
                req.params.detailAccountId, req.query));

        res.json(result);
    }));

router.route('/:id/lines')
    .get(async((req, res) => {
        let journalLineQuery = new JournalLineQuery(req.branchId, req.user.id),
            result = await(journalLineQuery.getAll(req.params.id, req.query));
        res.json(result);
    }));

module.exports = router;


