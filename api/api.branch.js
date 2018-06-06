"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex'),
    config = instanceOf('config'),
    Memory = instanceOf('Memory'),
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

        let cmd = req.body;

        if (Utility.String.isNullOrEmpty(cmd.name))
            return res.sendStatus(400).send('نام کسب و کار نباید خالی باشد');

        let entity = {
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

        res.json({id: entity.id});

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

router.route('/:id/on-activated')
    .post(async((req, res) => {
        let id = req.params.id;

        Memory.remove(`branch:${id}-isActive`);

        res.sendStatus(200);
    }));

router.route('/:id/on-deactivated')
    .post(async((req, res) => {
        let id = req.params.id;

        Memory.remove(`branch:${id}-isActive`);

        res.sendStatus(200);
    }));

router.route('/:id/users')
    .get(async((req, res) => {
        let id = req.params.id,
            NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],

            member = await(knex.select('*').from('userInBranches').where({token}).first());

        if (!member)
            return NoAuthorizedResponseAction();

        if (member.branchId !== id)
            return NoAuthorizedResponseAction();

        if (!member.isOwner)
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
                    .where('userInBranches.branchId', id)
                    .as('base');
            }),
            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);
    }))
    .post(async(function (req, res) {

        let id = req.params.id,
            userId = req.body.userId,
            NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],

            member = await(knex.select('*').from('userInBranches').where({token}).first());

        if (!member)
            return NoAuthorizedResponseAction();

        if (member.branchId !== id)
            return NoAuthorizedResponseAction();

        if (!member.isOwner)
            return NoAuthorizedResponseAction();

        let isUserMember = await(
            knex.select('id').from('userInBranches').where({branchId: id, userId}).first()
        );

        if (isUserMember)
            return res.status(400).send(['کاربر عضو این کسب و کار هست']);

        member = {
            userId,
            branchId: id,
            state: 'active',
            app: 'accounting',
            token: TokenGenerator.generate256Bit()
        };

        await(knex('userInBranches').insert(member));

        res.sendStatus(200);

    }));

router.route('/:id/users/:userId')
    .delete(async(function (req, res) {
        let id = req.params.id,
            userId = req.params.userId,
            NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],

            member = await(knex.select('*').from('userInBranches').where({token}).first());

        if (!member)
            return NoAuthorizedResponseAction();

        if (member.branchId !== id)
            return NoAuthorizedResponseAction();

        if (member.isOwner && member.userId === userId)
            return res.sendStatus(400);

        if (!(member.isOwner || member.userId === userId))
            return NoAuthorizedResponseAction();

        let userInBranch = await(knex.select('*').from('userInBranches').where({branchId: id, userId}).first());

        await(knex('userInBranches').where({id: userInBranch.id}).del());

        res.sendStatus(200);

        Memory.remove(`token:${userInBranch.token}-branch-member`);
    }));

router.route('/:id/users/:userId/regenerate-token')
    .put(async(function (req, res) {
        let id = req.params.id,
            userId = req.params.userId,
            NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],

            member = await(knex.select('*').from('userInBranches').where({token}).first());

        if (!member)
            return NoAuthorizedResponseAction();

        if (member.branchId !== id)
            return NoAuthorizedResponseAction();

        if (!member.isOwner)
            return NoAuthorizedResponseAction();

        let newToken = TokenGenerator.generate256Bit(),
            lastToken = await(knex
                .select('token')
                .from('userInBranches')
                .where({userId, branchId: id})
                .first());

        await(knex('userInBranches').where({userId, branchId: id}).update({token: newToken}));

        res.sendStatus(200);

        Memory.remove(`token:${lastToken.token}-branch-member`);
    }));

router.route('/:id/users/:userId/is-member')
    .get(async(function (req, res) {
        let id = req.params.id,
            userId = req.params.userId,
            NoAuthorizedResponseAction = () => res.status(401).send('No Authorized'),
            token = req.headers["x-access-token"],

            member = await(knex.select('*').from('userInBranches').where({token}).first());

        if (!member)
            return NoAuthorizedResponseAction();

        if (member.branchId !== id)
            return NoAuthorizedResponseAction();

        let isMember = await(knex.select('id').from('userInBranches').where({
            branchId: member.branchId,
            userId
        }).first());

        res.send(!!isMember);
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


module.exports = router;

