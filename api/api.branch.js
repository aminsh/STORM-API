"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex'),
    config = instanceOf('config'),
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
            .where({id: req.params.branchId})
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

router.route('/users/:token/regenerate-token')
    .put(async((req, res) => {
        let members = await(knex.select(
            knex.raw('users.id as "userId"'),
            'users.email',
            'users.name',
            'users.image',
            'userInBranches.token',
            'userInBranches.id',
            'userInBranches.isOwner')
            .from('users')
            .leftJoin('userInBranches', 'users.id', 'userInBranches.userId')
            .where('userInBranches.branchId', req.branchId)
            .as('base')
        ),

        memberId = parseInt(req.params.id),
            isOwner = members.asEnumerable().any(e => e.isOwner && e.userId === req.user.id),
            userIsRegeneratingOwnToken = members.asEnumerable().any(e => e.id === memberId && e.userId === req.user.id);

        if(!members.asEnumerable().any(e => e.id === memberId))
            return res.status(404).send('No Found');

        if (!isOwner && !userIsRegeneratingOwnToken)
            return res.status(401).send('No Authorized');

        try {
            let newToken = TokenGenerator.generate256Bit();

            await(knex('userInBranches').where('id', memberId).update({token: newToken}));
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: ['internal error']});
        }

    }));

module.exports = router;

