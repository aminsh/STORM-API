var express = require('express');
var router = express.Router();
var reportJournalRouteHandler = require('../route.handlers/report/journal');

router.route('/journal/:id').get(reportJournalRouteHandler.journal);
router.route('/json/journal/:id').get(reportJournalRouteHandler.json);

module.exports = router;
