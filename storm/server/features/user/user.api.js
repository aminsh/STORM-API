"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    authenticate = require('../../config/auth').authenticate,
    md5 = require('md5'),
    Guid = require('../../services/shared').utility.Guid,
    UserRepository = require('./user.repository'),
    UserQuery = require('./user.query');

router.route('/register').post(async((req, res) => {
    let userRepository = new UserRepository(),
        cmd = req.body,
        user = {
            email: cmd.email,
            name: cmd.name,
            password: md5(cmd.password),
            state: 'pending',
            token: Guid.new()
        };

    await(userRepository.create(user));
    res.json({isValid: true});
}));

router.route('/is-unique-email/:email')
    .get(async((req, res) => {
        let userQuery = new UserQuery(),
            user = await(userQuery.getByEmail(req.params.email));

        res.json({isValid: user != null});
    }));


module.exports = router;