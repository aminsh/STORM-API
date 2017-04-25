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
        let journalQuery = new JournalQuery(req.cookies['branch-id']),
            result = await(journalQuery.getAll(req.cookies['current-period'], req.query));
        res.json(result);
    }))
    .post(require('./batch.journal').Insert);

router.route('/total-info').get((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getTotalInfo(req.cookies['current-period']));

    res.json(result);
});

router.route('/max-number').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getMaxNumber(req.cookies['current-period']));
    res.json(result);
}));

router.route('/:id')
    .get(async((req, res) => {
        let journalQuery = new JournalQuery(req.cookies['branch-id']),
            result = await(journalQuery.batchFindById(req.params.id));
        res.json(result);
    }))
    .put(require('./batch.journal').update)
    .delete(require('./batch.journal').delete);

router.route('/by-number/:number').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getByNumber(
            req.cookies['current-period'],
            req.params.number));

    res.json(result);
}));

router.route('/summary/grouped-by-month').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getGroupedByMouth(req.cookies['current-period']));
    res.json(result);
}));

router.route('/month/:month').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getJournalsByMonth(
            req.params.month,
            req.cookies['current-period'],
            req.query));
    res.json(result);
}));

router.route('/period/:periodId').get(async((req, res) => {
    let journalQuery = new JournalQuery(req.cookies['branch-id']),
        result = await(journalQuery.getAllByPeriod(req.cookies['current-period'], req.query));
    res.json(result);
}));

router.route('/:id/bookkeeping').put(async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        fiscalPeriodRepository = new FiscalPeriodRepository(req.cookies['branch-id']),
        errors = [],
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatue == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    journal.journalStatus = 'BookKeeped';


    await(journalRepository.update(entity));

    return res.json({ isValid: true });

}));

router.route('/:id/fix').put(async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        fiscalPeriodRepository = new FiscalPeriodRepository(req.cookies['branch-id']),
        errors = [],
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(req.params.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatue == 'Fixed')
        errors.push(translate('This journal is already fixed'));

    journal.journalStatus = 'Fixed';

    await(journalRepository.update(journal));

    return res.json({ isValid: true });
}));

router.route('/:id/attach-image').put(async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        journal = await(journalRepository.findById(req.params.id));

    journal.attachmentFileName = req.body.fileName;

    await(journalRepository.update(journal));

    return res.json({ isValid: true });
}));

router.route('/:id/copy').post(async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']);

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
        returnValue: { id: entity.id }
    });
}));

module.exports = router;


/*
 .post(async((req, res) => {
 let journalRepository = new JournalRepository(req.cookies['branch-id']),
 fiscalPeriodRepository = new FiscalPeriodRepository(req.cookies['branch-id']),
 errors = [],
 cmd = req.body,
 currentFiscalPeriodId = req.cookies['current-period'],
 temporaryNumber,
 currentFiscalPeriod = await(fiscalPeriodRepository.findById(currentFiscalPeriodId));

 if (currentFiscalPeriod.isClosed)
 errors.push(translate('The current period is closed , You are not allowed to create Journal'));

 if (cmd.temporaryNumber) {
 let checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
 cmd.temporaryNumber,
 currentFiscalPeriod.id));

 if (checkExistsJournalByTemporaryNumber)
 errors.push(translate('The journal with this TemporaryNumber already created'));
 else
 temporaryNumber = cmd.temporaryNumber;

 }
 else {
 temporaryNumber = (await(journalRepository.maxTemporaryNumber(currentFiscalPeriodId)) || 0) + 1
 }

 let temporaryDateIsInPeriodRange =
 cmd.temporaryDate >= currentFiscalPeriod.minDate &&
 cmd.temporaryDate <= currentFiscalPeriod.maxDate;

 if (!temporaryDateIsInPeriodRange)
 errors.push(translate('The temporaryDate is not in current period date range'));

 if (errors.asEnumerable().any())
 return res.json({
 isValid: !errors.asEnumerable().any(),
 errors: errors
 });

 let entity = {
 periodId: currentFiscalPeriodId,
 createdById: req.user.id,
 journalStatus: 'Temporary',
 temporaryNumber: temporaryNumber,
 temporaryDate: cmd.temporaryDate || persianDateSerivce.current(),
 description: cmd.description,
 isInComplete: true
 };

 entity = await(journalRepository.create(entity));

 return res.json({
 isValid: true,
 returnValue: {id: entity.id}
 });
 }));

delete(async((rea, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        errors = [],
        cmd = req.body,
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(cmd.id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

    if (journal.journalStatue == 'Fixed')
        errors.push(translate('The current journal is fixed , You are not allowed to delete it'));

    //check for journal line

    if (errors.asEnumerable().any())
        return res.json({
            isValid: !errors.asEnumerable().any(),
            errors: errors
        });

    await(journalRepository.remove(req.params.id));

    return res.json({isValid: true});
}))

.put(async((req, res) => {
    let branchId = req.cookies['branch-id'],
        journalRepository = new JournalRepository(branchId),
        fiscalPeriodRepository = new FiscalPeriodRepository(branchId),
        errors = [],
        id = req.params.id,
        cmd = req.body,
        currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
        journal = await(journalRepository.findById(id));

    if (currentFiscalPeriod.isClosed)
        errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

    let checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
        cmd.temporaryNumber,
        currentFiscalPeriod.id));

    if (checkExistsJournalByTemporaryNumber && checkExistsJournalByTemporaryNumber.id != cmd.id)
        errors.push(translate('The journal with this TemporaryNumber already created'));

    let temporaryDateIsInPeriodRange =
        cmd.temporaryDate >= currentFiscalPeriod.minDate &&
        cmd.temporaryDate <= currentFiscalPeriod.maxDate;

    if (!temporaryDateIsInPeriodRange)
        errors.push(translate('The temporaryDate is not in current period date range'));

    if (journal.journalStatue == 'Fixed')
        errors.push(translate('The current journal is fixed , You are not allowed to edit it'));

    if (errors.asEnumerable().any())
        return res.json({
            isValid: false,
            errors: errors
        });

    let entity = await(journalRepository.findById(id));

    entity.temporaryDate = cmd.temporaryDate;
    entity.temporaryNumber = cmd.temporaryNumber;
    entity.journalType = cmd.journalType;
    entity.date = cmd.date;
    entity.number = cmd.number;
    entity.description = cmd.description;

    await(journalRepository.update(entity));
    await(journalRepository.updateTags(id, cmd.tagIds));

    return res.json({isValid: true});
}))*/
