"use strict";

const config = require('./'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    UserRepository = require('../features/user/user.repository'),
    userRepository = new UserRepository(),
    memoryService = require('../../../shared/services/memoryService'),
    string = require('../services/shared').utility.String,
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

function configure() {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async((id, done) => {

        if (string.isEmail(id)) {
            let user = memoryService.get('demoUsers')
                .asEnumerable()
                .singleOrDefault(u => u.id == id);

            return done(null, user);
        }

        let user = await(userRepository.getById(id));

        done(null, user);
    }));

    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passReqToCallback: true
            },
            async((req, email, password, done) => {
                if (req.demoUser)
                    return done(null, {id: req.demoUser.id, name: req.demoUser.name});

                let user = await(userRepository.getUserByEmailAndPassword(email, password));
                if (user)
                    return done(null, user);
                return done(null, false, {message: 'Username or password in incorrect'});
            })
        ));

    /* auth by google */
    passport.use(
        new GoogleStrategy(
            config.auth.google,
            (token, refreshToken, profile, done) => {
                process.nextTick(async(() => {
                    let user = await(userRepository.getById(profile.id));

                    if (user) return done(null, user);

                    user = {
                        id: profile.id,
                        googleToken: token,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        state: 'active'
                    };

                    await(userRepository.create(user));

                    return done(null, user);
                }));
            }));
}

function authenticate(req, res, next) {

    let auth = passport.authenticate('local', function (err, user) {
        if (err) return next(err);
        if (!user)return res.send({isValid: false, errors: ['Username or password in incorrect']});
        req.logIn(user, async(function (err) {
            if (err) return next(err);

            res.send({
                isValid: true,
                returnValue: {
                    currentUser: user.name
                }
            });
        }));
    });

    auth(req, res, next);
}

module.exports[configure.name] = configure;
module.exports[authenticate.name] = authenticate;
module.exports.googleAuthenticate = passport.authenticate('google', {scope: ['profile', 'email']});
module.exports.googleAuthenticateCallback = passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login'
});





