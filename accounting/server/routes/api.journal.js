"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    Guid = instanceOf('utility').Guid,
    JournalService = ApplicationService.JournalService,
    JournalQuery = require('../queries/query.journal');

router.route('/')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getAll(req.cookies['current-period'], req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'journalCreate'});

            const id = new JournalService(req.branchId, req.fiscalPeriodId).create(cmd);

            EventEmitter.emit('onServiceSucceed', serviceId, {id});

            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
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
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: {cmd, id},
                state: req,
                service: 'journalUpdate'
            });

            new JournalService(req.branchId, req.fiscalPeriodId).update(id, cmd);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }))
    .delete(async((req, res) => {
        let id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'journalRemove'});

            new JournalService(req.branchId).remove(id);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});
        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }));

router.route('/:id/confirm')
    .put(async((req, res) => {
        let id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'journalFix'});

            new JournalService(req.branchId).fix(id);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});
        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
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
    let id = req.params.id,
        serviceId;

    try {

        serviceId = Guid.new();

        EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'journalBookkeeping'});

        new JournalService(req.branchId).bookkeeping(id);

        EventEmitter.emit('onServiceSucceed', serviceId);

        res.json({isValid: true});
    }
    catch (e) {
        EventEmitter.emit('onServiceFailed', serviceId, e);

        const errors = e instanceof ValidationException
            ? e.errors
            : ['internal errors'];

        res['_headerSent'] === false && res.json({isValid: false, errors});

        console.log(e);
    }

}));

router.route('/:id/attach-image').put(async((req, res) => {
    let id = req.params.id,
        serviceId;

    try {

        serviceId = Guid.new();

        EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'journalAttachImage'});

        new JournalService(req.branchId).attachImage(id, req.body.fileName);

        EventEmitter.emit('onServiceSucceed', serviceId);

        res.json({isValid: true});
    }
    catch (e) {
        EventEmitter.emit('onServiceFailed', serviceId, e);

        const errors = e instanceof ValidationException
            ? e.errors
            : ['internal errors'];

        res['_headerSent'] === false && res.json({isValid: false, errors});

        console.log(e);
    }
}));

router.route('/:id/copy').post(async((req, res) => {

    let id = req.params.id,
        serviceId;

    try {

        serviceId = Guid.new();

        EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'journalCopy'});

        const id = new JournalService(req.branchId).clone(id);

        EventEmitter.emit('onServiceSucceed', serviceId, {id});

        res.json({isValid: true, returnValue: {id}});
    }
    catch (e) {
        EventEmitter.emit('onServiceFailed', serviceId, e);

        const errors = e instanceof ValidationException
            ? e.errors
            : ['internal errors'];

        res['_headerSent'] === false && res.json({isValid: false, errors});

        console.log(e);
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


