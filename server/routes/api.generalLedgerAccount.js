var express = require('express');
var router = express.Router();
var generalLedgerAccountRouteHandlers = require('../route.handlers/generalLedgerAccount');

router.route('/general-ledger-accounts')
    .get(generalLedgerAccountRouteHandlers.getAll)
    .post(generalLedgerAccountRouteHandlers.create);

router.route('/general-ledger-accounts/:id')
    .get(generalLedgerAccountRouteHandlers.getById)
    .put(generalLedgerAccountRouteHandlers.update)
    .delete(generalLedgerAccountRouteHandlers.remove);

router.route('/general-ledger-accounts/:id/activate').put(generalLedgerAccountRouteHandlers.activate);
router.route('/general-ledger-accounts/:id/deactivate').put(generalLedgerAccountRouteHandlers.deactivate);


module.exports = router;