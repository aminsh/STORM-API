"use strict";

"use strict";

const express = require('express'),
    router = express.Router(),
    googleAuthenticate = require('../../config/auth').googleAuthenticate,
    googleAuthenticateCallback = require('../../config/auth').googleAuthenticateCallback;

router.route('/google').get(googleAuthenticate);

router.route('/google/callback').get(googleAuthenticateCallback);

module.exports = router;