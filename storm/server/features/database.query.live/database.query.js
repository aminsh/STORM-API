"use strict";

const express = require('express'),
    config = require('../../config'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    superSecret = require('../../../../shared/services/cryptoService').superSecret,
    knex_development = require('knex')({
        client: 'pg',
        connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting'
    }),
    knex_staging = require('knex')({
        client: 'pg',
        connection: 'postgres://main:cTurGu1aPHpAyWzCm02B@storm-pg1.int.eu-central-1a.abarcloud.com:3433/staging'
        || 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting'
    }),
    knex_production = require('knex')({
        client: 'pg',
        connection: 'postgres://main:cTurGu1aPHpAyWzCm02B@storm-pg1.int.eu-central-1a.abarcloud.com:3433/production'
    }),
    db = {knex_development,knex_staging, knex_production};


router.route('/')
    .get((req, res) => {
        res.render('database.ejs');
    })
    .post((req, res) => {
        let cmd = req.body,
            data = JSON.parse(cmd.data),
            knex = db[`knex_${cmd.env}`];

        jwt.verify(cmd.token, superSecret, function (err, pass) {
            if (err)
                return res.send('token is not provided');

            run();
        });

        function run() {
            knex(cmd.table).insert(data)
                .then(() => res.send('success'))
                .catch(e => res.json(e));
        }

    });

module.exports = router;