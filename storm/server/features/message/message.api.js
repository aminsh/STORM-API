"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = require('../../config'),
    emailService = require('../../services/emailService'),
    translate = require('../../services/translateService');

router.route('/send-message').post((req, res) => {
    let message = req.body;

    res.json({isValid: true});

    emailService.send({
        to: 'amin@storm-online.ir',
        subject: `Email from ${message.name} - contact us`,
        html: `<p><h1>${message.name}</h1></p>
               <p>${message.email}</p>
               <p>${message.phone}</p>
               <p>${message.message}</p>`
    });

});

router.route('/request-luca-demo').post((req, res) => {
    let info = req.body;

    res.json({isValid: true});

    emailService.send({
        to: 'amin@storm-online.ir',
        subject: `Email from ${info.name || info.email} - request for luca demo`,
        html: `<p><h1>Name: ${info.name}</h1></p>
               <p>Email: ${info.email}</p>`
    });

    let token = require('../queries/query.token')
            .authToken({id: info.email, name: info.name || info.email},
                'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea'),
        url = `${config.url.luca}/?token=${token}`;

    emailService.send({
        to: info.email,
        subject: translate('Luca demo link'),
        html: `<p><h3>${translate('Hello')}</h3></p>
               <p>${url}</p>`
    });

});

module.exports = router;