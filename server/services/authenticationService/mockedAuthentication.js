"use strict";

var passport = require('passport'),
    url = require('url'),
    config = require('../config'),
    eventEmitter = require('../../services/eventEmitter'),
    routeHandler = require('../../utilities/routeHandler'),
    indexRouter = require('../../routes')
        .asEnumerable()
        .single(r => r.method.toLowerCase() == 'get' && r.path == '/');

class MockedAuthentication {

    constructor(req, res, memoryService) {
        this.req = req;
        this.res = res;
        this.memoryService = memoryService;

        this.branchConfig = config.branch;
    }

    authenticate() {
        this.setBranch();

        let users = [this.user];
        this.usersOnMemory = users;

        this.login();
    }

    get data() {
        return { branchId: this.branchConfig.id };
    }

    get user() {
        return config.user;
    }

    get usersOnMemory() {
        return this.memoryService.get('users');
    }

    set usersOnMemory(users) {
        this.memoryService.set('users', users);
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
            if (req.originalUrl.startsWith('/logo')) return next();

            return routeHandler(req, indexRouter.handler)
        }

        if (req.xhr)
            return res.status(401).send('user is not authenticated');

        return res.redirect('/auth/return');
    }
}

module.exports = MockedAuthentication;