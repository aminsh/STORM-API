var express = require('express');
var router = express.Router();
var dimensionCategoryRouteHandlers = require('../route.handlers/dimensionCategory');

router.route('/dimension-categories')
    .get(dimensionCategoryRouteHandlers.getAll)
    .post(dimensionCategoryRouteHandlers.create);

router.route('/dimension-categories/:id')
    .get(dimensionCategoryRouteHandlers.getById)
    .put(dimensionCategoryRouteHandlers.update)
    .delete(dimensionCategoryRouteHandlers.remove);

module.exports = router;

