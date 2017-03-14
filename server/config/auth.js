"use strict";

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    knex = require('../services/knexService'),
    md5 = require('md5');

function configure() {
    "use strict";

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        knex.table('users').where('id', id).first()
            .then(user => done(null, user));
    });

    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passReqToCallback: true
            },
            function (req, email, password, done) {
                knex.table('users')
                    .where('email', 'ILIKE', email).first()
                    .andWhere('password', md5(password))
                    .then(user => {
                        if (user)
                            return done(null, user);
                        return done(null, false, {message: 'Username or password in incorrect'});
                    });
            }
        ));
}

function authenticate(req, res, next) {

    let auth = passport.authenticate('local', function (err, user) {
        if (err) return next(err);
        if (!user)return res.send({isValid: false, errors: ['Username or password in incorrect']});
        req.logIn(user, function (err) {
            let token = req.cookies['branch-id'] && req.cookies['return-url']
                ? require('../queries/query.token').authToken(user, req.cookies['branch-id'])
                : null;

            if (err) return next(err);
            res.send({
                isValid: true,
                returnValue: {
                    currentUser: user.name,
                    returnUrl: token ? '{0}/?token={1}'.format(req.cookies['return-url'], token) : null
                }
            });
        })
    });

    auth(req, res, next);
}

module.exports[configure.name] = configure;
module.exports[authenticate.name] = authenticate;





