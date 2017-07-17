const express = require('express'),
    router = express.Router(),
    config = require('../../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('./user.repository'),
    crypto = require('../../../../shared/services/cryptoService');


router.route('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        userRepository = new UserRepository(),
        user = await(userRepository.getByToken(token));

    user.token = null;
    user.state = 'active';

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

router.route('/forgot-password')
    .get(async((req, res) => {

        // Render forgot-password page

    }));

router.route('/reset-password/:token')
    .get(async((req,res) => {

        try{

            let token_data = crypto.verify(req.params.token),
                userRepository = new UserRepository(),
                user = await(userRepository.getById(token_data.id));

            if(user !== null){

                // Render Main Reset Password Page

            } else {

                // Render 404 Page

            }

        } catch(e) {

            // Render Error Page
            // Error: "An error has occurred !!!"
            console.log(e.message);

        }

    }));

module.exports = router;