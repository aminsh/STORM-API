"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    AccountReview = require('../queries/query.accountReview');

router.route('/general-ledger-account')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.generalLedgerAccount());
        res.json(result);
    }));

route.route('/subsidiary-ledger-account')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.subsidiaryLedgerAccount());
        res.json(result);
    }));

route.route('/detail-account')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.detailAccount());
        res.json(result);
    }));

route.route('/dimension-1')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.dimension1());
        res.json(result);
    }));

route.route('/dimension-2')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.dimension2());
        res.json(result);
    }));

route.route('/dimension-3')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.dimension3());
        res.json(result);
    }));

route.route('/tiny')
    .get(async((req, res) => {
        let accountReview = getAccountReviewInstance(req),
            result = await(accountReview.tiny());
        res.json(result);
    }));

module.exports = router;

function getAccountReviewInstance(req) {
    const filter = (req.query.extra) ? req.query.extra.filter : undefined;
    return new AccountReview(
        req.knex,
        req.cookies['current-period'],
        filter,
        req.query);
}
