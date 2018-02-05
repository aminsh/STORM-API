"use strict";

const passport = require('passport'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('../../integration/google/authentication').Strategy;

module.exports = class {
    constructor() {
        this.userRepository = instanceOf('user.repository');
    }


    isAuthenticated(req, res, next) {

        let userKey = req.cookies["USER-KEY"];

        if (!userKey) {
            next();
            return false;
        }

        let user = instanceOf("UserQuery").getByToken(userKey);

        if (!user) {
            next();
            return false;
        }

        req.user = user;
        next();
    }

    login(USER_KEY, req, res) {
        let date = new Date();
        date.setTime(date.getTime() + (48 * 60 * 60 * 1000));

        res.cookie('USER-KEY', USER_KEY, {expires: date});
    }

    logout(req, res){
        res.clearCookie("USER-KEY");
        res.clearCookie("BRANCH-KEY");
    }

    serialize() {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
    }

    deserialize() {
        passport.deserializeUser(async((id, done) => {

            let user = await(this.userRepository.getById(id));

            done(null, user);
        }));
    }

    useLocalStrategy() {
        passport.use(
            new LocalStrategy({
                    usernameField: 'email',
                    passReqToCallback: true
                },
                async((req, email, password, done) => {

                    let user = await(this.userRepository.getUserByEmailAndPassword(email, password));
                    if (user)
                        return done(null, user);
                    return done(null, false, {message: 'Username or password in incorrect'});
                })
            ));
    }

    useGoogleStrategy() {
        passport.use(GoogleStrategy());
    }

    authenticate(req, res, next) {

        let auth = passport.authenticate('local', function (err, user) {
            if (err) return next(err);
            if (!user) return res.send({isValid: false, errors: ['Username or password in incorrect']});

            instanceOf('Authentication').login(user.token, req, res);

            let reCaptchaUserResponse = null;

            if (instanceOf('config').env !== "development")
                reCaptchaUserResponse = req.body.reCaptchaResponse;

            instanceOf('captcha').verify(reCaptchaUserResponse)
                .then(() => res.send({
                    isValid: true,
                    returnValue: {
                        currentUser: user.name,
                        token: user.token
                    }
                }))
                .catch(() => res.send({
                    isValid: false,
                    errors: ['Captcha is incorrect']
                }));

            //}));
        });

        auth(req, res, next);
    }
};