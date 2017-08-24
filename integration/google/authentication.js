"use strict";

const passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config');

module.exports.Strategy = () => {
    return new GoogleStrategy(
        config.auth.google,
        (token, refreshToken, profile, done) => {
            process.nextTick(async(() => {
                let userRepository = instanceOf('user.repository'),
                    user = await(userRepository.getById(profile.id));

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
        })
};

module.exports.googleAuthenticate = passport.authenticate('google', {scope: ['profile', 'email']});
module.exports.googleAuthenticateCallback = passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/login'
});