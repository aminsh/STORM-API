var express = require('express');
var router = express.Router();
var journalRouteHandlers = require('../route.handlers/journal');

router.route('/journals')
    .get(journalRouteHandlers.getAll)
    .post(journalRouteHandlers.create);

router.route('/journal/:id')
    .get(journalRouteHandlers.getById)
    .put(journalRouteHandlers.update)
    .delete(journalRouteHandlers.remove);

router.route('/journals/:id/bookkeeping').put(journalRouteHandlers.bookkeeping);
router.route('/journals/:id/fix').put(journalRouteHandlers.fix);
router.route('/journals/:id/attach-image').put(journalRouteHandlers.attachImage);

module.exports = router;