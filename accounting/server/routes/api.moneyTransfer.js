"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    persianDateSerivce = require('../services/persianDateService'),
    router = require('express').Router(),
    JournalRepository = require('../data/repository.journal'),
    SubsidiaryLedgetAccount = require('../data/repository.subsidiaryLedgerAccount'),
    DetailAccountRepository = require('../data/repository.detailAccount');


router.route('/')
    .post(async((req, res) => {
        let journalRepository = new JournalRepository(req.branchId),
            subsidiaryLedgerAccountRepository = new SubsidiaryLedgetAccount(req.branchId),
            detailAccountRepository = new DetailAccountRepository(req.branchId),
            fiscalPeriodRepository = new FiscalPeriodRepository(req.branchId),
            currentFiscalPeriod = await(fiscalPeriodRepository.findById(req.cookies['current-period'])),
            errors=[],
            cmd = req.body,

            sourceDetailAccount = await(detailAccountRepository.findById(cmd.source.accountId)),
            targetDetailAccount = await(detailAccountRepository.findById(cmd.target.accountId)),

            journal = {
                journalStatus: 'Fixed',
                isInComplete: false,
                periodId: req.fiscalPeriodId,
                temporaryNumber: (await(journalRepository.maxTemporaryNumber(req.fiscalPeriodId)).max || 0) + 1,
                temporaryDate: cmd.date || persianDateSerivce.current(),
                description: cmd.description || translate('Transfer money from ... to ...').format(
                    sourceDetailAccount.title,
                    targetDetailAccount.title
                )
            },

            sourceSubLedger = getSubLedgerByType(cmd.source.type, req.branchId),
            targetSubLedger = getSubLedgerByType(cmd.target.type, req.branchId),
            journalLines = [
                {
                    row: 1,
                    generalLedgerAccountId: sourceSubLedger.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: sourceSubLedger.id,
                    detailAccountId: cmd.source.accountId,
                    article: journal.description,
                    creditor: cmd.amount,
                    debtor: 0
                },
                {
                    row: 2,
                    generalLedgerAccountId: targetSubLedger.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: targetSubLedger.id,
                    detailAccountId: cmd.target.accountId,
                    article: journal.description,
                    creditor: 0,
                    debtor: cmd.amount
                }
            ];

        let temporaryDateIsInPeriodRange =
            cmd.date >= currentFiscalPeriod.minDate &&
            cmd.date <= currentFiscalPeriod.maxDate;

        if (!temporaryDateIsInPeriodRange)
            errors.push(translate('The temporaryDate is not in current period date range'));

        if (errors.length != 0)
            return res.json({isValid: false, errors});

        await(journalRepository.batchCreate(journalLines, journal));

        res.json({isValid: true});
    }));

module.exports = router;


