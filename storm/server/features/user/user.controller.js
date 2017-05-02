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

    await(userRepository.update(user));

    res.render('index.ejs');
}));

router.route('/profile').get(async((req, res) => {
    let branchRepository = new BranchRepository(),
        branchId = config.env == 'development'
            ? config.branchId
            : await(branchRepository.getBranchId(req.user.id));

    res.cookie('branch-id', branchId);
    res.redirect((branchId) ? config.url.accounting : '/');
}));

module.exports = router;