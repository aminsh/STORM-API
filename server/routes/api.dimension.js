var express = require('express');
var router = express.Router();
var dimensionRouteHandlers = require('../route.handlers/dimension');

router.route('/dimensions/category/:categoryId')
    .get(dimensionRouteHandlers.getAll)
    .post(dimensionRouteHandlers.create);

router.route('/dimensions/:id')
    .get(dimensionRouteHandlers.getById)
    .put(dimensionRouteHandlers.update)
    .delete(dimensionRouteHandlers.remove);

router.route('/dimensions/:id/activate').put(dimensionRouteHandlers.activate);
router.route('/dimensions/:id/deactivate').put(dimensionRouteHandlers.deactivate);

module.exports = router;