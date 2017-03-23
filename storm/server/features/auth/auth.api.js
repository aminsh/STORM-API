"use strict";

const express = require('express'),
    router = express.Router(),
    authenticate = require('../../config/auth').authenticate;

router.route('/login').post(authenticate);

router.route('/logout').post((req, res) => {
    if (req.isAuthenticated())
        req.logout();
    res.json({isValid: true});
});

module.exports = router;
