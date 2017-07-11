"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    translate = require('../services/translateService'),
    persianDateSerivce = require('../services/persianDateService'),
    router = require('express').Router(),
    JournalRepository = require('../data/repository.journal'),
    SubsidiaryLedgetAccount = require('../data/repository.subsidiaryLedgerAccount'),
    DetailAccountRepository = require('../data/repository.detailAccount'),

    getSubLedgerByType = async((type, repository) => {
        let code;

        if (type == 'fund')
            code = '1101';
        if (type == 'bank')
            code = '1103';

        return repository.findByCode(code);
    });


router.route('/')
    .post(async((req, res) => {
        let journalRepository = new JournalRepository(req.branchId),
            subsidiaryLedgerAccountRepository = new SubsidiaryLedgetAccount(req.branchId),
            detailAccountRepository = new DetailAccountRepository(req.branchId),

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

            sourceSubLedger = await(getSubLedgerByType(cmd.source.type, subsidiaryLedgerAccountRepository)),
            targetSubLedger = await(getSubLedgerByType(cmd.target.type, subsidiaryLedgerAccountRepository)),
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

        await(journalRepository.batchCreate(journalLines, journal));

        res.json({isValid: true});
    }));

module.exports = router;


