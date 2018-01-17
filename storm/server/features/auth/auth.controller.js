"use strict";

const express = require('express'),
    router = express.Router(),
    googleAuthentication = require('../../../../integration/google/authentication'),
    Authentication = instanceOf('Authentication');

router.route('/google').get(googleAuthentication.googleAuthenticate);

router.use('/google/callback', googleAuthentication.googleAuthenticateCallback);
router.route('/google/callback').get(function (req, res) {
    const token = req.USER_KEY;

    delete req.USER_KEY;

    Authentication.login(token, req, res);

    let returnUrl = req.cookies['return-url'];

    if(returnUrl)
        res.clearCookie("return-url");

    if (returnUrl)
        return res.redirect(returnUrl);

    res.redirect('/acc');
});

router.route('/logout').all((req, res) => {

    Authentication.logout(req, res);

    res.redirect('/login');
});


module.exports = router;