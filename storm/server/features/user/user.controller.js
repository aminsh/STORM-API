const express = require('express'),
    router = express.Router(),
    config = require('../../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('./user.repository'),
    crypto = require('../../../../shared/services/cryptoService'),
    TokenRepository = require('../token/token.repository');


router.route('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        userRepository = new UserRepository(),
        user = await(userRepository.getByToken(token));

    try{

        user.token = null;
        user.state = 'active';

    } catch(err) {

        if(!req.isAuthenticated())
            return res.redirect("/login");

        return res.redirect("/profile");

    }

    await(userRepository.update(user.id, user));

    req.logIn(user, function (err) {
        if (err) return next(err);
        res.render('index.ejs');
    });
}));

router.route('/profile').get(async((req, res) => {
    let returnUrl = req.cookies['return-url'];

    if(returnUrl)
        res.cookie('return-url', '', {expires: new Date(0)});

    if (returnUrl && returnUrl !== '/profile')
        return res.redirect(returnUrl);

    res.render('index.ejs');
}));

module.exports = router;