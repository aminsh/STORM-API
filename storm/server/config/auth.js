"use strict";

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    knex = require('../services/knexService'),
    md5 = require('md5'),
    memoryService = require('../services/memoryService'),
    string = require('../utilities/string');

function configure() {
    "use strict";

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {

        if (string.isEmail(id)) {
            let user = memoryService.get('demoUsers')
                .asEnumerable()
                .singleOrDefault(u => u.id == id);

            return done(null, user);
        }

        knex.table('users').where('id', id).first()
            .then(user => done(null, user));
    });

    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passReqToCallback: true
            },
            function (req, email, password, done) {
                if (req.demoUser)
                    return done(null, {id: req.demoUser.id, name: req.demoUser.name});

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
            if (err) return next(err);
            res.send({
                isValid: true,
                returnValue: {
                    currentUser: user.name
                }
            });
        });
    });

    auth(req, res, next);
}

module.exports[configure.name] = configure;
module.exports[authenticate.name] = authenticate;





