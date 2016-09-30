var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('../models'),
    md5 = require('md5');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.user.findById(id).then(function (user) {
        done(null, user);
    });
});

passport.use(
    new LocalStrategy(
        function (username, password, done) {
            db.user.findOne({
                where: {
                    username: username,
                    password: md5(password)
                }
            }).then(function (user) {
                if (user)
                    return done(null, user);
                return done(null, false, {message: 'Username or password in incorrect'});
            });
        }
    ));




