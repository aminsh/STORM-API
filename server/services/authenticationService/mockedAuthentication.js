"use strict";

const passport = require('passport'),
    url = require('url'),
    config = require('../../config'),
    eventEmitter = require('../../services/eventEmitter'),
    memoryService = require('../../services/memoryService'),
    indexRouteHandler = require('../../routes').handler;

class MockedAuthentication {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    authenticate() {
        this.setBranch();
        this.usersOnMemory = [this.user];
        this.login();
    }

    get data() {
        return {branchId: config.branch.id};
    }

    get user() {
        return config.user;
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
        this.res.redirect('/auth/return');
    }

    middleware() {
        const req = this.req,
            res = this.res;

        if (req.isAuthenticated()) {
            if (req.xhr) return next();
            return indexRouteHandler(req, res);
        }

        if (req.xhr)
            return res.status(401).send('user is not authenticated');

        return res.redirect('/auth/return');
    }
}

module.exports = MockedAuthentication;