var express = require('express');
var router = express.Router();
var journalTemplateRouteHandler = require('../route.handlers/journalTemplate');

router.route('/journal-templates').get(journalTemplateRouteHandler.getAll)
router.route('/journal-templates/journal/:journalId').post(journalTemplateRouteHandler.create);

router.route('/journal-templates/:id/journal/create').post(journalTemplateRouteHandler.journalCreate);

router.route('/journal-templates/:id').delete(journalTemplateRouteHandler.remove);

module.exports = router;
