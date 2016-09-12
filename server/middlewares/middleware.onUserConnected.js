var async = require('asyncawait/async');
var await = require('asyncawait/await');
var db = require('../models/index');

var onUserConnected = async(function (req, res, next) {
    if (!req.cookies['current-period']) {
        var maxId = await(db.fiscalPeriod.max('id'));

        if (!maxId)
            throw new Error('max fiscal period on user connected middleware is undefined');

        res.cookie('current-period', maxId);
    }

    next();
});


module.exports = onUserConnected;

