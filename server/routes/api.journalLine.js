var express = require('express');
var router = express.Router();
var journalLineRouteHandler = require('../route.handlers/journalLine');

router.route('/journal-lines/journal/:journalId')
    .get(journalLineRouteHandler.getAll)
    .post(journalLineRouteHandler.create);

router.route('/journal-lines/:id')
    .get(journalLineRouteHandler.getById)
    .put(journalLineRouteHandler.update)
    .delete(journalLineRouteHandler.remove);

module.exports = router;