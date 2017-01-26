"use strict";

var passport = require('passport'),
    url = require('url'),
    config = require('../../config'),
    memoryService = require('../../services/memoryService'),
    cryptoServivce = require('../../services/cryptoService'),
    eventEmitter = require('../../services/eventEmitter'),
    indexRouteHandler = require('../../routes').handler;

class IntegratedAuthentication {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    authenticate() {
        if (this.goToLoginUrlIfTokenIsNotValid())
            return;

        this.setBranch();

        let users = this.usersOnMemory,
            isUserExistsInMemory = users.asEnumerable().any(u => u.id == this.user.id);

        if (!isUserExistsInMemory) {
            users.push(this.user);
            this.usersOnMemory = users;

            eventEmitter.emit('on-user-created', this.user, this.req);
        }

        this.login();
    }

    get data() {
        let token = (url.parse(req.url).query)
            ? url.parse(req.url).query.replace('token=', '')
            : null;

        return cryptoServivce.decrypt(token);
    }

    get user() {
        return this.data.user;
    }

    get usersOnMemory() {
        return memoryService.get('users');
    }

    set usersOnMemory(users) {
        memoryService.set('users', users);
    }

    setBranch() {
        this.res.cookie('branch-id', this.data.branchId);
    }

    login() {
        let auth = passport.authenticate('local', () => {
            this.req.logIn(this.user, err => {
                if (err) new Error(err);

                return this.res.redirect('/');
            });
        });

        auth(this.req, this.res);
    }

    logout() {
        this.res.redirect(config.auth.logout)
    }

    middleware() {
        const req = this.req,
            res = this.res;

        if (req.isAuthenticated()) {
            if (req.xhr) return next();
            if (req.originalUrl.startsWith('/logo')) return next();

            return indexRouteHandler(req, res);
        }

        if (req.originalUrl.startsWith('/auth/return'))
            return next();

        if (req.xhr)
            return res.status(401).send('user is not authenticated');

        var url = `${config.auth.url}/?returnUrl=${config.auth.returnUrl}`;

        return res.redirect(url);
    }

    goToLoginUrlIfTokenIsNotValid() {
        let loginUrl = `${config.auth.url}/?returnUrl=${config.auth.returnUrl}`;
        res.redirect(loginUrl);
        return true;
    }
}

module.exports = IntegratedAuthentication;