"use strict";

const express = require('express'),
    config = require('../../config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    branchRepository = require('./branch.repository'),
    userRepository = new (require('../user/user.repository')),
    branchQuery = require('./branch.query'),
    superSecret = require('../../../../shared/services/cryptoService').superSecret,
    Image = require('../../services/shared').utility.Image,
    EventEmitter = require('../../services/shared').service.EventEmitter,
    render = require('../../services/shared').service.render.renderFile,
    persianDate = require('../../services/shared').service.PersianDate,
    email = require('../../services/emailService.js');

router.route('/')
    .get(async((req, res) => {
        let branches = await(branchQuery.getAll(req.query));
        res.json(branches);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            entity = {
                name: cmd.name,
                ownerName: cmd.ownerName,
                logo: cmd.logo
                    ? Image.toBase64(`${config.rootPath}/../${cmd.logo}`)
                    : config.logo,
                phone: cmd.phone,
                mobile: cmd.mobile,
                address: cmd.address,
                postalCode: cmd.postalCode,
                nationalCode: cmd.nationalCode,
                ownerId: req.user.id,
                webSite: cmd.webSite,
                offCode: cmd.offCode,
                status: 'pending'
            };

        await(branchRepository.create(entity));

        res.json({isValid: true});

        EventEmitter.emit('on-branch-created', entity.id);
    }));

router.route('/:id').delete(async((req, res) => {
    let id = req.params.id;

    await(branchRepository.remove(id));

    res.json({isValid: true});

    EventEmitter.emit('on-branch-removed', id);
}));

router.route('/:id/activate')
    .put(async((req, res)=> {

        let branchId = req.params.id;

        await(branchRepository.update(branchId, {status: 'active'}));
        res.json({isValid: true});

        let branch = await(branchRepository.getById(branchId));
        let date = new Date();
        render("email-activated-template.ejs", {
            user: {
                name: branch.ownerName
            },
            branch: {
                name: branch.name
            },
            loginUrl: config.url.origin,
            sendTime: {
                date: `${persianDate.current()}`
            },
            btn: {
                text: "ورود به کسب و کار"
            },

        }).then(function(html){

            email.send({
                from: "info@storm-online.ir",
                to: branch.ownerEmail,
                subject: "فعال سازی نرم افزار حسابداری آنلاین استورم",
                html: html
            });

        }).catch(function(err){

            console.log(`Error: The email DIDN'T send successfuly !!! `, err);

        });

    }));

router.route('/:id/deactivate')
    .put(async((req, res) => {
        await(branchRepository.update(req.params.id, {status: 'pending'}));
        res.json({isValid: true});
    }));

router.route('/:id/add-me')
    .put(async((req, res) => {
        await(branchRepository.addMember(req.params.id, req.user.id));
        res.json({isValid: true});
    }));

router.route('/current')
    .get(async((req, res) => {
        let currentBranch = await(branchQuery.getById(req.cookies['branch-id']));
        res.json(currentBranch);
    }))
    .put(async((req, res) => {
        let cmd = req.body,

            entity = {
                name: cmd.name,
                ownerName: cmd.ownerName,
                phone: cmd.phone,
                mobile: cmd.mobile,
                address: cmd.address,
                postalCode: cmd.postalCode,
                nationalCode: cmd.nationalCode
            };

        if (cmd.logoFileName)
            entity.logo = Image.toBase64(`${config.rootPath}/../${cmd.logoFileName}`);

        await(branchRepository.update(req.cookies['branch-id'], entity));

        res.json({isValid: true});
    }));

router.route('/current/api-key').get(async((req, res) => {
    let currentBranch = await(branchRepository.getById(req.cookies['branch-id'])),
        apiKey;

    if (currentBranch.apiKey)
        apiKey = currentBranch.apiKey;
    else {
        let owner = await(userRepository.getById(currentBranch.ownerId)),

            apiKey = jwt.sign({
                branchId: currentBranch.id,
                userId: owner.id
            }, superSecret);

        await(branchRepository.update(currentBranch.id, {apiKey}));
    }

    res.json({apiKey});
}));

router.route('/my').get(async((req, res) => {
    let branches = await(branchQuery.getBranchesByUser(req.user.id));
    res.json(branches);
}));

router.route('/:id/default-logo').put(async((req, res)=> {
    let id = req.params.id;

    await(branchRepository.update(id, {logo: config.logo}));

    res.json({isValid: true});
}));

module.exports = router;