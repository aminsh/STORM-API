var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('../models');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.user.findById(1).then(function (user) {
        done(null, user);
    });
});

passport.use(
    new LocalStrategy(
        function (username, password, done) {
            db.user.findById(1).then(function (user) {
                if (user)
                    return done(null, user);
                return done(null, false, {message: 'login is not successfully'});
            });
        }
    ));




