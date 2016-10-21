var express = require('express');
var router = express.Router();
var accountReviewHandler = require('../route.handlers/accountReview');

router.route('/account-review/general-ledger-account').get(accountReviewHandler.generalLedgerAccount);
router.route('/account-review/subsidiary-ledger-account').get(accountReviewHandler.subsidiaryLedgerAccount);
router.route('/account-review/detail-account').get(accountReviewHandler.detailAccount);
router.route('/account-review/dimension-1').get(accountReviewHandler.dimension1);
router.route('/account-review/dimension-2').get(accountReviewHandler.dimension2);
router.route('/account-review/dimension-3').get(accountReviewHandler.dimension3);

module.exports = router;


