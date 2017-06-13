"use strict";

const jwt = require('jsonwebtoken'),
    app = require('../config/express'),
    superSecret = require('../services/cryptoService').superSecret;

module.exports = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'],
        noTokenProvidedMessage = {
            success: false,
            message: 'No token provided.'
        };


    if (!token)
        return res.status(403).send(noTokenProvidedMessage);

    jwt.verify(token, superSecret, (err, decode) => {
        if(err)
            return res.status(403).send(noTokenProvidedMessage);

        req.branchId = decode.branchId;
        req.userId = decode.userId;

        next();
    });
};