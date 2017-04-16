const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalRepository = require('../data/repository.journal'),
    JournalLineRepository = require('../data/repository.journalLine'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    translate = require('../services/translateService');

module.exports.Insert = async((req, res) => {
        let branchId = req.cookies['branch-id'],
            currentFiscalPeriodId = req.cookies['current-period'],
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(currentFiscalPeriodId)),
            cmd = req.body,
            journalRepository = new JournalRepository(branchId),
            subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId),
            errors = [];

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


        let entity = {
            periodId: currentFiscalPeriodId,
            createdById: req.user.id,
            journalStatus: 'Temporary',
            temporaryNumber: temporaryNumber,
            temporaryDate: cmd.temporaryDate || persianDateSerivce.current(),
            description: cmd.description,
            isInComplete: true,
            attachmentFileName: cmd.attachmentFileName,
            journalType: cmd.journalType,
            tagId: cmd.tagId
        };

        let journalLines = cmd.journalLines.asEnumerable()
            .select(journalLine =>
                ({
                    subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccountId,
                    detailAccountId: journalLine.detailAccountId,
                    dimension1Id: journalLine.dimension1Id,
                    dimension2Id: journalLine.dimension2Id,
                    dimension3Id: journalLine.dimension3Id,
                    article: journalLine.article,
                    debtor: journalLine.debtor,
                    creditor: journalLine.creditor,
                    row: journalLine.row
                }))
            .toArray();

        journalLines[article].forEach(function (article) {
            if (string.isNullOrEmpty(article))
                errors.push(translate('The Article is required'));

            if (article.length < 3)
                errors.push(translate('The Article should have at least 3 character'));
        });


        journalLines.forEach(journalLine => {
            let subsidiaryId = journalLine.subsidiaryLedgerAccountId,
                subsidiaryLedgerAccount = await(subsidiaryLedgerAccountRepository.findById(subsidiaryId));

            if (!subsidiaryLedgerAccount.hasDetailAccount && journalLines[index].detailAccountId) {
                errors.push(translate('The detailAccount is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension1 && journalLine.dimension1Id) {
                errors.push(translate('The Dimension1 is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension2 && journalLine.dimension2Id) {
                errors.push(translate('The Dimension2 is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension3 && journalLine.dimension3Id) {
                errors.push(translate('The Dimension3 is not define'));
            }

            if (journalLine.debtor != 0 && journalLine.creditor != 0) {
                errors.push(translate('Debtor and creditor are not allowed to have value , both of them'));
            }

            if (journalLine.debtor == 0 && journalLine.creditor == 0) {
                errors.push(translate('Debtor and creditor are not allowed to be zero , both of them'));
            }

            journalLine.generalLedgerAccountId = subsidiaryLedgerAccount.generalLedgerAccountId;
            journalLine.journalId = entity.id;
        });

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let jId = await(journalRepository.batchCreate(journalLines, entity));

        return res.json({
            isValid: true,
            returnValue: {id: jId}
        });

    });

module.exports.update =  async((req, res) => {
        let branchId = req.cookies['branch-id'],
            journalRepository = new JournalRepository(branchId),
            journalLineRepository = new JournalLineRepository(branchId),
            fiscalPeriodRepository = new FiscalPeriodRepository(branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            cmd = req.body,
            journalId = req.params.id;
        errors = [];

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to edit Journal'));

        if (checkExistsJournalByTemporaryNumber && checkExistsJournalByTemporaryNumber.id != journalId)
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

        let entity = await(journalRepository.findById(journalId));

        entity.temporaryDate = cmd.temporaryDate;
        entity.temporaryNumber = cmd.temporaryNumber;
        entity.journalType = cmd.journalType;
        entity.date = cmd.date;
        entity.number = cmd.number;
        entity.description = cmd.description;

        let cmdJournalLines = cmd.journalLines.asEnumerable()
            .select(journalLine => ({
                subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccountId,
                detailAccountId: journalLine.detailAccountId,
                dimension1Id: journalLine.dimension1Id,
                dimension2Id: journalLine.dimension2Id,
                dimension3Id: journalLine.dimension3Id,
                article: journalLine.article,
                debtor: journalLine.debtor,
                creditor: journalLine.creditor,
                row: journalLine.row
            }))
            .toArray();

        cmdJournalLines.forEach(journalLine => {
            let subsidiaryId = journalLine.subsidiaryLedgerAccountId,
                subsidiaryLedgerAccount = await(subsidiaryLedgerAccountRepository.findById(subsidiaryId));

            if (!subsidiaryLedgerAccount.hasDetailAccount && journalLine.detailAccountId) {
                errors.push(translate('The detailAccount is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension1 && journalLine.dimension1Id) {
                errors.push(translate('The Dimension1 is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension2 && journalLine.dimension2Id) {
                errors.push(translate('The Dimension2 is not define'));
            }
            if (!subsidiaryLedgerAccount.hasDimension3 && journalLine.dimension3Id) {
                errors.push(translate('The Dimension3 is not define'));
            }

            if (journalLine.debtor != 0 && journalLine.creditor != 0) {
                errors.push(translate('Debtor and creditor are not allowed to have value , both of them'));
            }

            if (journalLine.debtor == 0 && journalLine.creditor == 0) {
                errors.push(translate('Debtor and creditor are not allowed to be zero , both of them'));

                createdLines.generalLedgerAccountId = subsidiaryLedgerAccount.generalLedgerAccountId;
                createdLines.journalId = entity.id;
            }
        });

        let dbJournalLines = await(journalLineRepository.getAll(entity.id));

        let createdLines = cmdJournalLines.asEnumerable().where(line => !dbJournalLines.any(p => p.id == line.id)).toArray(),
            updatedLines = dbJournalLines.asEnumerable().where(line => cmdJournalLines.includes(line.id)).toArray(),
            deletedLines = dbJournalLines.asEnumerable().where(line => !cmdJournalLines.includes(line.id)).toArray();

        await(journalRepository.batchUpdate(createdLines, updatedLines, deletedLines, entity));

    });

module.exports.delete = async((rea, res) => {
        let journalRepository = new JournalRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body,
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            journal = await(journalRepository.findById(cmd.id));

        if (currentFiscalPeriod.isClosed)
            errors.push(translate('The current period is closed , You are not allowed to delete Journal'));

        if (journal.journalStatue == 'Fixed')
            errors.push(translate('The current journal is fixed , You are not allowed to delete it'));

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(journalRepository.remove(req.params.id));

        return res.json({isValid: true});
    });


