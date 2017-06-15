"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    persianDateSerivce = require('../services/persianDateService'),
    router = require('express').Router(),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    JournalRepository = require('../data/repository.journal'),
    JournalQuery = require('../queries/query.journal');

router.route('/')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.branchId),
            result = await(journalQuery.getAll(req.cookies['current-period'], req.query));
        res.json(result);
    }))
    .post(require('./batch.journal').Insert);

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
    .put(require('./batch.journal').update)
    .delete(require('./batch.journal').delete);

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
    let journalRepository = new JournalRepository(req.branchId),
        fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
        errors = [],
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatus == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    journal.journalStatus = 'BookKeeped';


    await(journalRepository.update(entity));

    return res.json({isValid: true});

}));

router.route('/:id/fix').put(async((req, res) => {
    let journalRepository = new JournalRepository(req.branchId),
        fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
        errors = [],
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatus == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    journal.journalStatus = 'Fixed';

    await(journalRepository.update(journal));

    return res.json({isValid: true});
}));

router.route('/:id/attach-image').put(async((req, res) => {
    let journalRepository = new JournalRepository(req.branchId),
        journal = await(journalRepository.findById(req.params.id));

    journal.attachmentFileName = req.body.fileName;

    await(journalRepository.update(journal));

    return res.json({isValid: true});
}));

router.route('/:id/copy').post(async((req, res) => {
    let journalRepository = new JournalRepository(req.branchId);

    const id = req.params.id,
        periodId = req.cookies['current-period'],
        journal = await(journalRepository.findById(id));

    let newJournalLines = journal.journalLines.asEnumerable()
        .select(line =>
            ({
                generalLedgerAccountId: line.generalLedgerAccountId,
                subsidiaryLedgerAccountId: line.subsidiaryLedgerAccountId,
                detailAccountId: line.detailAccountId,
                dimension1Id: line.dimension1Id,
                dimension2Id: line.dimension2Id,
                dimension3Id: line.dimension3Id,
                article: line.article,
                debtor: line.debtor,
                creditor: line.creditor
            }))
        .toArray();

    let entity = {
        periodId: periodId,
        createdById: req.user.id,
        journalStatus: 'Temporary',
        temporaryNumber: (await(journalRepository.maxTemporaryNumber(periodId)) || 0) + 1,
        temporaryDate: persianDateSerivce.current(),
        description: journal.description,
        journalLines: newJournalLines
    };

    entity = await(journalRepository.create(entity));

    return res.json({
        isValid: true,
        returnValue: {id: entity.id}
    });
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


