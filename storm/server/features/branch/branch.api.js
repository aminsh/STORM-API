"use strict";

const express = require('express'),
    config = instanceOf('config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    branchRepository = instanceOf("branch.repository"),

    /**@type {BranchService}*/
    BranchService = instanceOf('branchService'),
    userRepository = new (require('../user/user.repository')),
    branchQuery = require('./branch.query'),
    superSecret = instanceOf('Crypto').superSecret,
    EventEmitter = instanceOf('EventEmitter'),
    render = instanceOf('htmlRender').renderFile,
    persianDate = instanceOf('utility').PersianDate,
    email = instanceOf('Email'),
    renewChartOfAccounts = require('../setup/setup.chartOfAccounts');

function shouldBeAdmin(req, res, next) {
    if (!req.isAuthenticated())
        return res.status(404).send();

    if (req.user.role !== 'admin')
        return res.status(404).send();

    next();
}

function shouldHaveBranch(req, res, next) {
    if(!req.branchId)
        return res.status(404).send('Not found');

    next();
}

function shouldAuthenticated(req, res, next) {
    if(!req.isAuthenticated())
        return res.status(401).send('Not found');

    next();
}

router.use(async(function (req, res, next) {
    const branchKey = req.cookies['BRANCH-KEY'];

    if(!branchKey)
        return next();

    let result = branchRepository.findByToken(branchKey);

    if(result)
        req.branchId = result.branchId;

    next();
}));

router.use('/', shouldBeAdmin);
router.route('/')
    .get(async((req, res) => {
        if (!req.isAuthenticated())
            return res.status(404).send();

        if (req.user.role !== 'admin')
            return res.status(404).send();

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
                registrationNumber: cmd.registrationNumber,
                ownerId: req.user.id,
                webSite: cmd.webSite,
                offCode: cmd.offCode,
                fax: cmd.fax,
                province: cmd.province,
                city: cmd.city,
                status: 'pending'
            };

        await(branchRepository.create(entity));

        res.json({isValid: true});

        EventEmitter.emit('on-branch-created', entity.id);
    }));

router.route('/by-token/:token')
    .get(async(function (req, res) {

        if (!req.params.token)
            return res.status(404).send('Not found');

        let branch = branchQuery.getBranchByToken(req.params.token);

        if (!branch)
            res.status(404).send('Not found');

        res.json(branch);
    }));

router.route('/:id').delete(async((req, res) => {

    return res.status(404).send('Not found');

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

        render("/storm/server/templates/email-activated-template.ejs", {
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

router.use('/:id/deactivate', shouldBeAdmin);
router.route('/:id/deactivate')
    .put(async((req, res) => {
        await(branchRepository.update(req.params.id, {status: 'pending'}));
        res.json({isValid: true});
    }));

router.use('/:id/add-me', shouldAuthenticated);
router.route('/:id/add-me')
    .put(async((req, res) => {
        await(branchRepository.addMember(req.params.id, req.user.id));
        res.json({isValid: true});
    }));


router.use('/:id/remove-me', shouldAuthenticated);
router.route('/:id/remove-me')
    .delete(async((req, res) => {
        await(branchRepository.deleteUserInBranch(req.params.id, req.user.id));
        res.json({isValid: true});
    }));

router.use('/:id/renew-chart-of-accounts', shouldBeAdmin);
router.route('/:id/renew-chart-of-accounts')
    .post(async((req, res) => {
        try {
            renewChartOfAccounts(req.params.id);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: [e]});
        }

    }));

router.use('/current', shouldHaveBranch);
router.route('/current')
    .get(async((req, res) => {
        let currentBranch = await(branchQuery.getById(req.branchId));
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
                nationalCode: cmd.nationalCode,
                registrationNumber: cmd.registrationNumber,
                province: cmd.province,
                city: cmd.city,
                fax: cmd.fax
            };

        if (cmd.logoFileName)
            entity.logo = `/${cmd.logoFileName}`;

        await(branchRepository.update(req.branchId, entity));

        res.json({isValid: true});
    }));

router.use('/current', shouldHaveBranch);
router.route('/current/api-key').get(async((req, res) => {
    let currentBranch = await(branchRepository.getById(req.branchId)),
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

router.use('/my', shouldAuthenticated);
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

router.use('/my', shouldAuthenticated);
router.use('/users/is-owner', shouldHaveBranch);
router.route('/users/is-owner')
    .get(async((req, res) => {

        let currentBranch = await(branchRepository.getById(req.branchId));

        try {
            return res.json({isValid: currentBranch.ownerId === req.user.id});
        } catch (err) {
            console.log(err);
            return res.json({isValid: false});
        }

    }));


router.route('/users/:id/regenerate-token')
    .put(async((req, res) => {

        if (!req.isAuth)
            return res.status(401).send('No Authorized');

        let id = req.params.id,
            member = branchRepository.getMember(id),
            branch = branchRepository.getById(member.branchId);

        if (branch.ownerId !== req.user.id)
            return res.status(401).send('No Authorized');

        try {
            BranchService.userRegenerateToken(req.params.id);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: ['internal error']});
        }

    }));

router.use('/users', shouldAuthenticated);
router.use('/users', shouldHaveBranch);
router.route('/users')
    .get(async((req, res) => {


        const branchId = req.branchId,
            isMember = branchRepository.getMemberByIdAndUserId(branchId, req.user.id);

        if (!isMember)
            return res.status(401).send('Not authorized');

        let members = branchRepository.getBranchMembers(branchId, req.query);
        return res.json(members);
    }));

router.use('/users/:email', shouldAuthenticated);
router.use('/users/:email', shouldHaveBranch);
router.route('/users/:email')
    .put((req, res) => {

        let branchId = req.branchId,
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

        let userEmail = req.params.email,
            branchId = req.branchId,
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

router.use('/logo', shouldAuthenticated);
router.use('/logo', shouldHaveBranch);
router.route("/logo")
    .get(async((req, res) => {

        try {

            let branch = await(branchQuery.getById(req.branchId));
            return res.json({isValid: true, returnValue: branch.logo});

        } catch (err) {

            console.log(err);
            return res.json({isValid: false});

        }

    }));
// [-END-] SMRSAN

module.exports = router;