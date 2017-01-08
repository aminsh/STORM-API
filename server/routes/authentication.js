"use strict";

var passport = require('passport'),
    url = require('url'),
    config = require('../config'),
    cryptoServivce = require('../services/cryptoService'),
    router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/auth/return',
    handler: (req, res, memoryService, eventEmitter)=> {

        let token = (url.parse(req.url).query)
                ? url.parse(req.url).query.replace('token=', '')
                : null,
            data = null;

        if(token && token != '')
            data = cryptoServivce.decrypt(token)

        if (!data) {
            let loginUrl = `${config.auth.url}/?returnUrl=${config.auth.returnUrl}`;
            return res.redirect(loginUrl);
        }

        res.cookie('branch-id', data.branchId);

        let user = data.user,
            users = memoryService.get('users');

        let isUserExistsInMemory = users.asEnumerable().any(u => u.id == user.id);
        if (!isUserExistsInMemory) {
            users.push(user);
            memoryService.set('users', users);

            eventEmitter.emit('on-user-created', user, req);
        }

        let auth = passport.authenticate('local', ()=> {
            req.logIn(user, (err)=> {
                if (err) new Error(err);

                return res.redirect('/');
            });
        }/*, {
         successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
         }*/);

        auth(req, res);
    }
});

router.route({
    method: 'GET',
    path: '/logout',
    handler: (req, res)=> res.redirect(config.auth.logout)
});

module.exports = router.routes;