var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = {
    authenticate: function (req, res, next) {
        var auth = passport.authenticate('local', function (err, user) {
            if (err) return next(err);
            if (!user) res.send({success: false, message: '��� �����? ?� ���� ���� ��?� �?��'});
            req.logIn(user, function (err) {
                if (err) return next(err);
                res.send({success: true, user: user});
            })
        });

        auth(req, res, next);
    },
    configure: function () {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id, done) {
            User.findById(id).exec(function (err, user) {
                done(null, user);
            });
        });

        passport.use(
            new LocalStrategy(function (username, password, done) {
                    console.log(username);
                    User.findOne({username: username, password: password})
                        .exec(function (err, user) {
                            if (err) {
                                console.log(err);
                                return done(null, false);
                            }

                            if (user) return done(null, user);
                            else return done(null, false);
                        });
                }
            ));
    }
}
