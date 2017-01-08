var router = require('../services/routeService').Router(),
    persianDateService = require('../services/persianDateService'),
    await = require('asyncawait/await');;

router.route({
    method: 'POST',
    path: '/journals',
    handler: (req, res, fiscalPeriodRepository, journalRepository)=> {
        var errors = [];
        var cmd = req.body;
        var current = req.cookies;

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to create Journal'));

        var checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
            cmd.temporaryNumber,
            currentFiscalPeriod.id));

        if (checkExistsJournalByTemporaryNumber)
            errors.push(translate('The journal with this TemporaryNumber already created'));

        var temporaryDateIsInPeriodRange =
            cmd.temporaryDate >= currentFiscalPeriod.minDate &&
            cmd.temporaryDate <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (errors.errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        var entity = {
            periodId: current.periodId,
            createdById: current.userId,
            journalStatus: 'Temporary',
            temporaryNumber: (await(journalRepository.maxTemporaryNumber(current.periodId)) || 0) + 1,
            temporaryDate: cmd.temporaryDate || persianDateService.current(),
            description: cmd.description,
            isInComplete: false
        };

        entity = await(journalRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

router.route({
    method: 'PUT',
    path: '/journals/:id',
    handler: (req, res, fiscalPeriodRepository,journalRepository)=> {
        var errors = [];
        var cmd = req.body;
        var current = req.cookies;

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(journalRepository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

        var checkExistsJournalByTemporaryNumber = await(journalRepository.findByTemporaryNumber(
            cmd.temporaryNumber,
            currentFiscalPeriod.id));

        if (checkExistsJournalByTemporaryNumber && checkExistsJournalByTemporaryNumber.id != cmd.id)
            errors.push(translate('The journal with this TemporaryNumber already created'));

        var temporaryDateIsInPeriodRange =
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

        var entity = await(journalRepository.findById(cmd.id));

        await(journalRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'DELETE',
    path: '/journals/:id',
    handler: (req, res, fiscalPeriodRepository, journalRepository)=> {
        var errors = [];
        var cmd = req.body;
        var current = req.cookies;

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var journal = await(journalRepository.findById(cmd.id));

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

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/journals/:id/bookkeeping',
    handler: (req, res, fiscalPeriodRepository, journalRepository)=> {
        var errors = [];
        var current = req.cookies;

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var entity = await(journalRepository.findById(req.params.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

        if (entity.journalStatue == 'Fixed')
            errors.push(translate('This journal is already fixed'));

        entity.journalStatus = 'BookKeeped';

        await(journalRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/journals/:id/fix',
    handler: (req, res, fiscalPeriodRepository, journalRepository)=> {
        var errors = [];
        var current = req.cookies;

        var currentFiscalPeriod = await(fiscalPeriodRepository.findById(current.id));
        var entity = await(journalRepository.findById(req.params.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

        if (entity.journalStatue == 'Fixed')
            errors.push(translate('This journal is already fixed'));

        var entity = await(journalRepository.findById(cmd.id));

        entity.journalStatus = 'Fixed';

        await(journalRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'PUT',
    path: '/journals/:id/attach-image',
    handler: (req, res,journalRepository)=> {
        var entity = await(journalRepository.findById(req.params.id));

        entity.attachmentFileName = req.body.fileName;

        await(journalRepository.update(entity));

        return res.json({
            isValid: true
        });
    }
});

router.route({
    method: 'POST',
    path: '/journals/:id/copy',
    handler: (req, res,journalRepository)=> {
        var id = req.params.id;
        var periodId = req.cookies['current-period'];

        var journal = await(journalRepository.findById(id));

        var newJournalLines = journal.journalLines.asEnumerable()
            .select(function (line) {
                return {
                    generalLedgerAccountId: line.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: line.subsidiaryLedgerAccountId,
                    detailAccountId: line.detailAccountId,
                    dimension1Id: line.dimension1Id,
                    dimension2Id: line.dimension2Id,
                    dimension3Id: line.dimension3Id,
                    article: line.article,
                    debtor: line.debtor,
                    creditor: line.creditor
                }
            })
            .toArray();

        var entity = {
            periodId: periodId,
            createdById: req.user.id,
            journalStatus: 'Temporary',
            temporaryNumber: (await(journalRepository.maxTemporaryNumber(periodId)) || 0) + 1,
            temporaryDate: persianDateService.current(),
            description: journal.description,
            journalLines: newJournalLines
        };

        entity = await(journalRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }
});

module.exports = router.routes;