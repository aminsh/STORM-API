var express = require('express');
var router = express.Router();
var subsidiaryLedgerAccountRouteHandlers = require('../route.handlers/subsidiaryLedgerAccount');

router.route('/subsidiary-ledger-accounts').get(subsidiaryLedgerAccountRouteHandlers.getAll);

router.route('/subsidiary-ledger-accounts/general-ledger-account/:parentId')
    .get(subsidiaryLedgerAccountRouteHandlers.getAllByGeneralLedgerAccount)
    .post(subsidiaryLedgerAccountRouteHandlers.create);

router.route('/subsidiary-ledger-accounts/:id')
    .get(subsidiaryLedgerAccountRouteHandlers.getById)
    .put(subsidiaryLedgerAccountRouteHandlers.update)
    .delete(subsidiaryLedgerAccountRouteHandlers.remove);

router.route('/subsidiary-ledger-accounts/:id/activate').put(subsidiaryLedgerAccountRouteHandlers.activate);
router.route('/subsidiary-ledger-accounts/:id/deactivate').put(subsidiaryLedgerAccountRouteHandlers.deactivate);

module.exports = router;
