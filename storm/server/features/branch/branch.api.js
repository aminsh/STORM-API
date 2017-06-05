"use strict";

const express = require('express'),
    config= require('../../config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    branchRepository = require('./branch.repository'),
    userRepository = new (require('../user/user.repository')),
    branchQuery = require('./branch.query'),
    superSecret = require('../../../../shared/services/cryptoService').superSecret,
    Image = require('../../services/shared').utility.Image;


router.route('/').post(async((req, res) => {
    let cmd = req.body,
        entity = {
            name: cmd.name,
            logo: cmd.logo
                ? Image.toBase64(`${config.rootPath}/../${cmd.logo}`)
                : config.logo,
            phone: cmd.phone,
            address: cmd.address
        };

    await(branchRepository.create(entity));

    res.cookie('branch-id', entity.id);

    res.json({isValid: true});
}));

router.route('/current').get(async((req, res) => {
    let currentBranch = await(branchQuery.getById(req.cookies['branch-id']));
    res.json(currentBranch);
}));

router.route('/current/api-key').get(async((req, res) => {
    let currentBranch = await(branchRepository.getById(req.cookies['branch-id'])),
        apiKey;

    if (currentBranch.apiKey)
        apiKey = currentBranch.apiKey;
    else {
        let owner = await(userRepository.getById(currentBranch.ownerId));
        apiKey = jwt.sign({branchId: currentBranch.id, user: {email: owner.email, id: owner.id}}, superSecret);

        await(branchRepository.update(currentBranch.id, {apiKey}));
    }

    res.json({apiKey});
}));

router.route('/my').get(async((req, res) => {
    let branches = branchQuery.getBranchesByUser(req.user.id);
    res.json(branches);
}));

module.exports = router;