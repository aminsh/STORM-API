var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    memoryService = require('../services/memoryService'),
    eventEmitter = require('../services/eventEmitter');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    var users = memoryService.get('users'),
        user = users.asEnumerable().single(user => user.id == id);

    done(null, user);
});

passport.use(
    new LocalStrategy({passReqToCallback: true},
        (req, username, password, done)=> {

            var user = req.authenticatedUser;

            if (!user)
                return done('user is undefined', null);

            var users = memoryService.get('users');

            var isUserExistsInMemory = users.asEnumerable().any(u=> u.id == user.id)
            if (!isUserExistsInMemory) {
                users.push(user);
                memoryService.set('users', users);

                eventEmitter.emit('on-user-created', user, req);
            }

            delete req.authenticatedUser;
            return done(null, user);
        }
    ));



