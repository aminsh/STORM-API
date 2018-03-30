"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex'),
    config = instanceOf('config'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    TokenGenerator = instanceOf('TokenGenerator');

router.route('/')
    .get(async(function (req, res) {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),

            userToken = req.headers["authorization"];

        if (!userToken)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('id').from('users').where({token: userToken}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        let branches = await(knex.select(
            'branches.id',
            'name',
            'logo',
            'userInBranches.token',
            'userInBranches.isOwner',
            'status',
            'address',
            'phone',
            'mobile',
            'webSite',
            'ownerName',
            'city',
            'branches.createdAt')
            .from('branches')
            .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
            .where('userInBranches.userId', user.id)
            .map(item => ({
                id: item.id,
                name: item.name,
                isOwner: item.isOwner,
                logo: item.logo,
                token: item.token,
                status: item.status,
                address: item.address,
                phone: item.phone,
                mobile: item.mobile,
                city: item.city,
                webSite: item.webSite,
                ownerName: item.ownerName,
                createdAt: item.createdAt,
                createdAtToPersian: Utility.PersianDate.getDate(item.createdAt)
            }))
        );

        res.json(branches);

    }))
    .post(async(function (req, res) {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),

            userToken = req.headers["authorization"];

        if (!userToken)
            return NoAuthorizedResponseAction();

        let user = await(knex.select('id').from('users').where({token: userToken}).first());

        if (!user)
            return NoAuthorizedResponseAction();

        let cmd = req.body,
            entity = {
                id: instanceOf('TokenGenerator').generate128Bit(),
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
                ownerId: user.id,
                webSite: cmd.webSite,
                offCode: cmd.offCode,
                fax: cmd.fax,
                province: cmd.province,
                city: cmd.city,
                status: 'pending'
            };

        await(knex('branches').insert(entity));

        res.json({isValid: true});

        EventEmitter.emit('on-branch-created', entity.id);
    }));

router.route('/:id')
    .put(async((req, res) => {

        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],
            id = req.params.id;

        if (!token)
            return NoAuthorizedResponseAction();


        let branch = await(knex.select('id')
            .from('branches')
            .where('id', id)
            .first());

        if (!branch)
            return res.sendStatus(404);

        let isUserMemberOfBranch = await(knex.select('id')
            .from('userInBranches')
            .where('token', token)
            .where('branchId', id)
            .first());

        if (!isUserMemberOfBranch)
            return NoAuthorizedResponseAction();

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

        await(knex('branches')
            .where({id})
            .update(entity));

        res.json({isValid: true});
    }));

router.route('/by-token/:token')
    .get(async(function (req, res) {
        if (!req.params.token)
            return res.status(404).send('Not found');

        let branch = await(knex.select(
            'branches.id',
            'name',
            'logo',
            'userInBranches.token',
            'userInBranches.isOwner',
            'status',
            'address',
            'phone',
            'mobile',
            'webSite',
            'ownerName',
            'nationalCode',
            'postalCode',
            'fax',
            'registrationNumber',
            'province',
            'city',
            'branches.createdAt')
            .from('branches')
            .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
            .where('userInBranches.token', req.params.token)
            .first());

        if (!branch)
            res.status(404).send('Not found');

        res.json(branch);
    }));

router.route('/users')
    .get(async(function (req, res) {
        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"];

        if (!token)
            return NoAuthorizedResponseAction();


        let userInBranch = await(knex.select('branchId')
            .from('userInBranches')
            .where('token', token)
            .first());

        if (!userInBranch)
            return NoAuthorizedResponseAction();

        let query = knex.from(function () {
                this.select(
                    knex.raw('users.id as "userId"'),
                    'users.email',
                    'users.name',
                    'users.image',
                    'userInBranches.token',
                    'userInBranches.id',
                    'userInBranches.isOwner')
                    .from('users')
                    .leftJoin('userInBranches', 'users.id', 'userInBranches.userId')
                    .where('userInBranches.branchId', userInBranch.branchId)
                    .as('base');
            }),
            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);
    }));
router.route('/users/:userId/regenerate-token')
    .put(async((req, res) => {


        let NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            userId = req.params.userId,
            token = req.headers["x-access-token"];

        if (!token)
            return NoAuthorizedResponseAction();

        let userInBranch = await(knex.select('*')
            .from('userInBranches')
            .where('token', token)
            .first());

        if(!userInBranch)
            return res.sendStatus(401);

        if(!(userInBranch.isOwner || userInBranch.userId === userId))
            return NoAuthorizedResponseAction();

        try {
            let newToken = TokenGenerator.generate256Bit();

            await(knex('userInBranches').where({userId, branchId: userInBranch.branchId}).update({token: newToken}));
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: ['internal error']});
        }

    }));

module.exports = router;

