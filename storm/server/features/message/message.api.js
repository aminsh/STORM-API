"use strict";

const express = require('express'),
    router = express.Router(),
    emailService = instanceOf('Email'),
    Crypto = instanceOf('Crypto');

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


module.exports = router;