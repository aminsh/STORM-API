"use strict";

const express = require('express'),
    router = express.Router();

router.route('/login').post(instanceOf('Authentication').authenticate);

router.route('/logout').post((req, res) => {
    if (req.isAuthenticated())
        req.logout();
    res.json({isValid: true});
});

module.exports = router;
