const express = require('express'),
    router = express.Router(),
    config = require('../../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('./user.repository');


router.route('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        userRepository = new UserRepository(),
        user = await(userRepository.getByToken(token));

    user.token = null;

    await(userRepository.update(user));

    res.render('index.ejs');
}));

router.route('/profile').get(async((req, res) => {
    if(config.env == 'development')
        res.cookie('branch-id', config.branchId);

   res.redirect('/');
}));

module.exports = router;