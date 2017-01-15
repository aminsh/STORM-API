"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');


var onUserConnected = async(function (req, res, next) {
    if (!req.isAuthenticated())
        return next();

    let kenx = req.ioc.resolve('knex'),
        db = req.ioc.resolve('db'),
        currentPeriod = req.cookies['current-period'];

    if (currentPeriod == null || currentPeriod == 0) {
        let maxId = await(kenx('fiscalPeriods').max('id'))[0].max;
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
    }

    if (!req.cookies['current-mode'])
        res.cookie('current-mode', 'Create');

    next();
});


module.exports = onUserConnected;

