var models = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var onUserConnectedMiddleware = async(function (req, res, next) {
    if (req.cookies['current-period']) {
        req.current = req.current || {};
        var period = await(models.fiscalPeriod.findById(req.cookies['current-period']));

        req.current.period = period;
    }
    else {
        var maxId = await(models.fiscalPeriod.max('id'));

        if (!maxId)
            throw new Error('max fiscal period on user connected middleware is undefined');

        res.cookie('current-period', maxId);
    }

    next();
});

module.exports = onUserConnectedMiddleware;

