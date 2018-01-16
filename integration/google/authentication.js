"use strict";

const passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    /**@type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');

module.exports.Strategy = () => {
    return new GoogleStrategy(
        Object.assign({},config.auth.google, {passReqToCallback: true}),
        (req, token, refreshToken, profile, done) => {
            process.nextTick(async(() => {
                let userRepository = instanceOf('user.repository'),
                    user = await(userRepository.getById(profile.id));

                if (user) {
                    req.USER_KEY = user.token;
                    done(null, user);
                    return;
                }

                user = {
                    id: profile.id,
                    googleToken: token,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                    state: 'active',
                    token: TokenGenerator.generate256Bit()
                };

                await(userRepository.create(user));

                req.USER_KEY = user.token;

                return done(null, user);
            }));
        })
};

module.exports.googleAuthenticate = passport.authenticate('google', {scope: ['profile', 'email']});
module.exports.googleAuthenticateCallback = passport.authenticate('google', {
    /*successRedirect: '/profile',*/
    failureRedirect: '/login'
});