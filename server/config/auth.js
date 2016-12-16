var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('../models'),
    md5 = require('md5');

function configure() {
    "use strict";

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        db.user.findById(id).then(function (user) {
            done(null, user);
        });
    });

    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passReqToCallback: true
            },
            function (req, email, password, done) {
                db.user.findOne({
                    where: {
                        email: {
                            $iLike: email
                        },
                        password: md5(password)
                    }
                }).then(function (user) {
                    if (user)
                        return done(null, user);
                    return done(null, false, {message: 'Username or password in incorrect'});
                });
            }
        ));
}

function authenticate(req, res, next) {

    var auth = passport.authenticate('local', function (err, user) {
        if (err) return next(err);
        if (!user)return res.send({isValid: false, errors: ['Username or password in incorrect']});
        req.logIn(user, function (err) {
            var token = req.cookies['branch-id'] && req.cookies['return-url']
                ? require('../queries/query.token').authToken(user.id, req.cookies['branch-id'])
                : null;

            if (err) return next(err);
            res.send({
                isValid: true,
                returnValue: {
                    currentUser: user.name,
                    returnUrl: token ? '{0}/?token={1}'.format(req.cookies['return-url'],token) : null
                }
            });
        })
    });

    auth(req, res, next);
}

module.exports[configure.name] = configure;
module.exports[authenticate.name] = authenticate;





