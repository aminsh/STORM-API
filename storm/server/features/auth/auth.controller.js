"use strict";

"use strict";

const express = require('express'),
    router = express.Router(),
    googleAuthenticate = require('../../config/auth').googleAuthenticate,
    googleAuthenticateCallback = require('../../config/auth').googleAuthenticateCallback;

router.route('/google').get(googleAuthenticate);

router.route('/google/callback').get(googleAuthenticateCallback);

router.route('/logout').all((req, res) => {
    if (req.isAuthenticated())
        req.logout();
    res.redirect('/login');
});


module.exports = router;