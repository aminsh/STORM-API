var express = require('express');
var router = express.Router();
var chequeCategoryRouteHandler = require('../route.handlers/chequeCategory');

router.route('/cheque-categories')
    .get(chequeCategoryRouteHandler.getAll)
    .post(chequeCategoryRouteHandler.create);

router.route('/cheque-categories/:id')
    .get(chequeCategoryRouteHandler.getById)
    .put(chequeCategoryRouteHandler.update)
    .delete(chequeCategoryRouteHandler.remove);

module.exports = router;