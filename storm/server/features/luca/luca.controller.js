"use strict";

const express = require('express'),
    router = express.Router(),
    url = require('url'),
    memoryService = require('../../services/shared').service.Memory,
    cryptoService = require('../../services/shared').service.Crypto;

router.route('/luca-demo').get((req, res) => {
    try {
        let token = (url.parse(req.url).query)
                ? url.parse(req.url).query.replace('token=', '')
                : null,
            info = cryptoService.decrypt(token);

        res.cookie('branch-id', info.branchId);

        req.demoUser = info.user;

        let demoUsers = memoryService.get('demoUsers');
        if (!demoUsers.asEnumerable().any(u => u.id == info.user.id))
            demoUsers.push(info.user);

        req.logIn(info.user, err => res.redirect('/luca'));

    } catch (e) {
        res.send('token is not valid please send email to support@storm-online.ir');
    }
});

module.exports = router;