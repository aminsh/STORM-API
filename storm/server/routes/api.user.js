"use strict";

const express = require('express'),
    router = express.Router(),
    authenticate = require('../config/auth').authenticate,
    md5 = require('md5'),
    guid = require('../utilities/guidService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knexService = require('../services/knexService');

router.route('/register')
    .get(function (req, res) {
        res.render('register.ejs');
    })
    .post(async((req, res) => {
        let cmd = req.body,
            user = {
                id: guid.newGuid(),
                email: cmd.email,
                name: cmd.name,
                password: md5(cmd.password),
                state: 'pending',
                token: guid.newGuid()
            };

        await(knexService('users').insert(user));
        res.json({isValid: true});
    }));

router.route('/login').post(authenticate);

router.route('/logout').post(function (req, res) {
    if (req.isAuthenticated())
        req.logout();
    res.json({isValid: true});
});

router.route('/is-unique-email/:email')
    .get(async((req, res) =>{
        let isEmailUnique = await(knexService
            .table('users')
            .where('email', req.params.email)
            .first());
        res.json({isValid: isEmailUnique != undefined});
    }));

router.route('/by-email/:email')
    .get(function (req, res) {
        knexService
            .select('id', 'email', 'name')
            .from('users')
            .where('email', 'ILIKE', req.params.email)
            .then(function (result) {
                res.json(result[0])
            });
    });

router.route('/return-url').get((req, res) => {
    let branchId = req.cookies['branch-id'];

    let token = branchId && req.cookies['return-url']
        ? require('../queries/query.token').authToken(req.user, branchId)
        : null;

    let returnUrl = token
        ? '{0}/?token={1}'.format(req.cookies['return-url'], token)
        : null;

    res.json(returnUrl);
});

module.exports = router;