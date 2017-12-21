"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),

    userRepository = instanceOf('user.repository'),
    /** @type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');


router.route('/')
    .post(async(function (req, res) {

        if(!(req.email && req.password))
            return res.status(400).send('نام کاربری یا کلمه عبور صحیح نیست');

        let user = userRepository.getUserByEmailAndPassword(req.body.email, req.body.password);

        if (user) {
            if (!user.token) {
                let token = TokenGenerator.generate256Bit();

                user.token = token;

                userRepository.update(user.id, {token});
            }

            return res.json({name: user.name, token: user.token});
        }

        return res.status(400).send('نام کاربری یا کلمه عبور صحیح نیست');
    }));

module.exports = router;


