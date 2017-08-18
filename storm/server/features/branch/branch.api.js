"use strict";

const express = require('express'),
    config = instanceOf('config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    branchRepository = require('./branch.repository'),
    userRepository = new (require('../user/user.repository')),
    branchQuery = require('./branch.query'),
    superSecret = instanceOf('Crypto').superSecret,
    EventEmitter = instanceOf('EventEmitter'),
    render = instanceOf('htmlRender').renderFile,
    persianDate = instanceOf('utility').PersianDate,
    email = instanceOf('Email');

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
                    ? `/${cmd.logo}`
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

    if (!req.isAuthenticated())
        return res.json({isValid: false});

    if (req.user.role !== "admin")
        return res.json({isValid: false});

    await(branchRepository.remove(id));

    res.json({isValid: true});

    EventEmitter.emit('on-branch-removed', id);
}));

router.route('/:id/activate')
    .put(async((req, res) => {

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

        }).then(function (html) {

            email.send({
                from: "info@storm-online.ir",
                to: branch.ownerEmail,
                subject: "فعال سازی نرم افزار حسابداری آنلاین استورم",
                html: html
            });

        }).catch(function (err) {

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
            entity.logo = `/${cmd.logoFileName}`;

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

router.route('/total').get(async((req, res) => {
    let result = await(branchQuery.totalBranches());
    res.json({total: result.count});
}));

router.route('/:id/default-logo').put(async((req, res) => {
    let id = req.params.id;

    await(branchRepository.update(id, {logo: config.logo}));

    res.json({isValid: true});
}));

// [START] SMRSAN
router.route('/users/is-owner')
    .get(async((req, res) => {

        if (!req.isAuthenticated())
            return res.json({isValid: false});

        let currentBranch = await(branchRepository.getById(req.cookies['branch-id']));

        try {
            return res.json({isValid: currentBranch.ownerId === req.user.id});
        } catch (err) {
            console.log(err);
            return res.json({isValid: false});
        }

    }));
router.route('/users')
    .get(async((req, res) => {

        if (!req.isAuthenticated())
            return res.json({isValid: false});

        let currentBranch = await(branchRepository.getById(req.cookies['branch-id']));

        try {

            if (currentBranch.ownerId !== req.user.id) {
                console.log(">>> Not Owner");
                return res.json({isValid: false});
            }

        } catch (err) {

            console.log(">>> Error: ", err);
            return res.json({isValid: false});

        }

        let branchUsers = await(branchRepository.getBranchMembers(currentBranch.id));
        return res.json({isValid: true, returnValue: branchUsers});


    }));
router.route('/users/:email')
    .put((req, res) => {

        if (!req.isAuthenticated())
            return res.json({isValid: false});

        let branchId = req.cookies['branch-id'],
            currentBranch = await(branchRepository.getById(branchId)),
            newUserEmail = req.params.email,
            user = null,
            userRecordInList = null;

        // Try to get user and it's record in branch members
        try {

            user = await(userRepository.getUserByEmail(newUserEmail));
            userRecordInList = await(branchRepository.getUserInBranch(branchId, user.id));

        } catch (err) {

            return res.json({isValid: false});

        }

        // Check if the user is not the branch owner
        if (currentBranch.ownerId !== req.user.id)
            return res.json({isValid: false});

        // Check if the user is activated
        if (user.state !== "active")
            return res.json({isValid: false});

        // Chack if the new member is the owner
        if (currentBranch.ownerId === user.id)
            return res.json({isValid: true, returnValue: "This user is the branch owner"});

        // Check if the user is already in list
        if (userRecordInList)
            return res.json({isValid: true, returnValue: "The user is already in the list"});

        // Check if user is the owner
        try {

            if (currentBranch.ownerId !== req.user.id) {
                // Not The Owner
                return res.json({isValid: false, errors: ["You have no permission"]});
            }

        } catch (err) {

            console.log(err);
            res.json({isValid: false});

        }

        // Add the member
        try {

            await(branchRepository.addMember(currentBranch.id, user.id));
            res.json({isValid: true});

        } catch (err) {

            console.log(err);
            res.json({isValid: false});

        }

    });
router.route("/users/:email")
    .delete(async((req, res) => {

        if (!req.isAuthenticated())
            return res.json({isValid: false});

        let userEmail = req.params.email,
            branchId = req.cookies["branch-id"],
            user = null;

        // Get User By Email
        try {

            user = await(userRepository.getUserByEmail(userEmail));

        } catch (err) {

            console.log(err);
            return res.json({isValid: false, errors: ["User not found"]});

        }

        console.log(`branchId: ${branchId}`);
        console.log(`user.id: ${user.id}`);

        // Delete user from branch
        try {

            await(branchRepository.deleteUserInBranch(branchId, user.id));
            return res.json({isValid: true});

        } catch (err) {

            console.log(err);
            return res.json({isValid: false});

        }

    }));
// [-END-] SMRSAN

module.exports = router;