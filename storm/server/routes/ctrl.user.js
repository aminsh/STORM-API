"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knex = require('../services/knexService');


router('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        user = await(knex.table('users').where('token', token).first());

    user.token = null;

    await(knex.table('users').where('id', user.id).update(user));

    res.render('index.ejs');
}));
