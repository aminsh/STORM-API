"use strict";

const config = require('../config'),
    translation = require('../config/translate.client.fa.json'),
    reports = require('../../reporting/report.config.json'),
    persianDate = require('../services/shared').service.PersianDate,
    superSecret = require('../services/cryptoService').superSecret,
    jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    res.locals = {
        today: persianDate.current(),
        translation,
        currentUser: req.user,
        version: config.version,
        reports: reports,
        env: config.env,
        token: jwt.sign({branchId: req.cookies['branch-id'], userId: req.user.id}, superSecret)
    };

    next();
};