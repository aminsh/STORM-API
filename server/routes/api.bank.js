var express = require('express');
var router = express.Router();
var bankRouteHandler = require('../route.handlers/bank');

router.route('/banks')
    .get(bankRouteHandler.getAll)
    .post(bankRouteHandler.create);

router.route('/banks/:id')
    .get(bankRouteHandler.getById)
    .put(bankRouteHandler.update)
    .delete(bankRouteHandler.remove);

module.exports = router;