"use strict";

const express = require('express'),
    router = express.Router(),
    url = require('url'),
    memoryService = require('../../services/shared').service.Memory,
    cryptoService = require('../../services/shared').service.Crypto;

router.route('/accounting-demo').get((req, res) => {
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

        req.logIn(info.user, err => res.redirect('/acc'));

    } catch (e) {
        res.send('token is not valid please send email to support@storm-online.ir');
    }
});

router.route('/demo').get((req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login');

    res.cookie('branch-id', 'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea');
    return res.redirect('/acc');
});

module.exports = router;