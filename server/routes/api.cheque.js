var express = require('express');
var router = express.Router();
var chequeRouteHandler = require('../route.handlers/cheque');

router.route('/cheques/category/:categoryId')
    .get(chequeRouteHandler.getAll);

router.route('/cheques/category/:categoryId/whites').get(chequeRouteHandler.getWhites);
router.route('/cheques/:id').get(chequeRouteHandler.getById);
router.route('/cheques/:id/write').put(chequeRouteHandler.write);

module.exports = router;