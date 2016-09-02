var express = require('express');
var detailAccountRouteHandlers = require('../route.handlers/detailAccount');

router.route('/detail-accounts')
    .get(detailAccountRouteHandlers.getAll)
    .post(detailAccountRouteHandlers.create);

router.route('/detail-accounts/:id')
    .get(detailAccountRouteHandlers.getById)
    .put(detailAccountRouteHandlers.update)
    .delete(detailAccountRouteHandlers.remove);

router.route('/detail-accounts/:id/activate').put(detailAccountRouteHandlers.activate);
router.route('/detail-accounts/:id/deactivate').put(detailAccountRouteHandlers.deactivate);


module.exports = router;