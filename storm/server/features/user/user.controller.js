const express = require('express'),
    router = express.Router(),
    config = require('../../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('./user.repository'),
    BranchRepository = require('../branch/branch.repository');


router.route('/activate/:token').get(async((req, res) => {
    let token = req.params.token,
        userRepository = new UserRepository(),
        user = await(userRepository.getByToken(token));

    user.token = null;
    user.state = 'active';

    await(userRepository.update(user.id ,user));

    req.logIn(user, function (err) {
        if (err) return next(err);
        res.render('index.ejs');
    });
}));

router.route('/profile').get(async((req, res) => {
    let branchRepository = new BranchRepository(),
        branchId = config.env == 'development'
            ? config.branchId
            : await(branchRepository.getBranchId(req.user.id)),
        returnUrl = req.cookies['return-url'];

    res.cookie('branch-id', branchId);
    res.redirect(returnUrl || ((branchId) ? config.url.accounting : '/'));
}));

module.exports = router;