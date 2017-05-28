"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    translate = require('../services/translateService'),
    PersianDate = require('../services/persianDateService'),
    DetailAccountCenterRepository = require('../data/repository.detailAccountCenter'),
    JournalRepository = require('../data/repository.journal'),
    FundQuery = require('../queries/query.fund');

router.route('/', async((req, res) => {
    let fundQuery = new FundQuery(req.cookies['branch-id']),
        result = await(fundQuery.getTotalFunds());

    res.json(result);
}));

router.route('/charge', async((req, res) => {
    let journalRepository = new JournalRepository(req.cookies['branch-id']),
        detailAccountCenterRepository = new DetailAccountCenterRepository(req.cookies['branch-id']),
        cmd = req.body,
        revolvingFund = await(detailAccountCenterRepository.findById(cmd.revolvingFundId)),
        bank = await(detailAccountCenterRepository.findById(cmd.bankId)),

        journal = {
            temporaryNumber: journalRepository.maxTemporaryNumber(req.cookies['current-period']),
            temporaryDate: PersianDate.current(),
            description: cmd.article
        },

        journalLines = [
            {
                row: 1,
                subsidiaryLedgerAccountId: revolvingFund.subsidiaryLedgerAccountId,
                detailAccountId: revolvingFund.detailAccountId,
                article: cmd.article,
                debtor: cmd.amount,
                creditor: 0,
            },
            {
                row: 2,
                subsidiaryLedgerAccountId: bank.subsidiaryLedgerAccountId,
                detailAccountId: bank.detailAccountId,
                article: cmd.article,
                debtor: 0,
                creditor: cmd.amount,
            }
        ];

    await(journalRepository.batchCreate(journalLines, journal));

    res.json({isValid: true});
}));

router.route('/spend', async((req, res) => {

}));

module.exports = router;