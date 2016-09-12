var express = require('express');
var router = express.Router();
var chequeRouteHandler = require('../route.handlers/cheque');

router.route('/cheques/category/:categoryId')
    .get(chequeRouteHandler.getAll)
    .post(chequeRouteHandler.create);

router.route('/cheques/:id')
    .get(chequeRouteHandler.getById)
    .put(chequeRouteHandler.update)
    .delete(chequeRouteHandler.remove);

module.exports = router;