"use strict";

"use strict";

const express = require('express'),
    router = express.Router(),
    googleAuthentication = require('../../../../integration/google/authentication');

router.route('/google').get(googleAuthentication.googleAuthenticate);

router.route('/google/callback').get(googleAuthentication.googleAuthenticateCallback);

router.route('/logout').all((req, res) => {
    if (req.isAuthenticated())
        req.logout();
    res.redirect('/login');
});


module.exports = router;