var express = require('express');
var router = express.Router();
var reportJournalRouteHandler = require('../route.handlers/report/journal');

router.route('/html/journal/:id').get(reportJournalRouteHandler.html);
router.route('/pdf/journal/:id').get(reportJournalRouteHandler.pdf);

module.exports = router;
