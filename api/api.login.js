"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    md5 = require('md5'),
    knex = instanceOf('knex');


router.route('/')
    .post(async(function (req, res) {

        let badRequestResponseAction = () => res.status(400).send('نام کاربری یا کلمه عبور صحیح نیست'),

            email = req.body.email,
            password = req.body.password;

        if (!(email && password))
            return badRequestResponseAction();

        let user = await(knex
            .select('id', 'token', 'email', 'name')
            .from('users')
            .where('state', 'active')
            .where('email', 'ILIKE', email)
            .where('password', md5(password.toString()))
            .first());

        if (!user)
            return badRequestResponseAction();

        return res.json({name: user.name, token: user.token});
    }));

module.exports = router;


