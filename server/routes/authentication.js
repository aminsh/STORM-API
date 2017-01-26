"use strict";

const config = require('../config'),
    router = require('express').Router(),
    Authentication = require('../services/authenticationService');

router.route('/auth/return').get((req, res) => {
    let authentication = new Authentication(req, res);
    authentication.authenticate();
});

router.route('/logout').get((req, res) => {
    let authentication = new Authentication(req, res);
    authentication.logout();
});

module.exports = router;