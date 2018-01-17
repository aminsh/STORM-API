const express = require('express'),
    router = express.Router(),
    config = require('../../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('./user.repository'),
    crypto = require('../../../../shared/services/cryptoService'),
    TokenRepository = require('../token/token.repository'),
    /**
     * @type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');


router.route('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        userRepository = new UserRepository(),
        user = await(userRepository.getByToken(token));

    if(!user)
        return res.redirect('/404');

    user.token = TokenGenerator.generate256Bit();
    user.state = 'active';

    await(userRepository.update(user.id, user));

    res.cookie('USER-KEY', user.token);

    res.redirect('/acc');
}));

router.route('/profile').get(async((req, res) => {
    let returnUrl = req.cookies['return-url'];

    if(returnUrl)
        res.clearCookie("return-url");

    if (returnUrl && returnUrl !== '/profile')
        return res.redirect(returnUrl);

    res.render('index.ejs');
}));

module.exports = router;