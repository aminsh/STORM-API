var express = require('express');
var router = express.Router();
var fiscalPeriodRouteHandler = require('../route.handlers/fiscalPeriod');

router.route('/fiscal-periods')
    .get(fiscalPeriodRouteHandler.getAll);

module.exports = router;
