"use strict";

const express = require('express'),
    router = express.Router(),
    guid = require('../utilities/guidService'),
    knexService = require('../services/knexService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = require('../config'),
    eventEmitter = require('../services/eventEmitter'),
    branchQuery = require('../queries/query.branch');

router.route('/')
    .get((req, res) => {
        knexService.select('id', 'name', 'logo', 'lucaConnectionId').from('branches')
            .then(branches => res.json(branches));
    })
    .post(async((req, res) => {
        let errors = [],
            cmd = req.body,
            entity = {
                id: guid.newGuid(),
                name: cmd.name,
                logo: cmd.logo,
                phone: cmd.phone,
                address: cmd.address,
                ownerId: req.user.id
            };

        entity = await(knexService('branches').insert(entity));

        res.json({isValid: true, returnValue: entity.id});
        eventEmitter.emit('on-branch-created', branchQuery.getById(entity.id))
    }));

router.route('/my').get(async(function (req, res) {
    var branches = await(knexService.select('id', 'name', 'logo')
        .from('branches').where('ownerId', req.user.id).union(function () {
            this.select('branches.id', 'branches.name', 'branches.logo')
                .from('userInBranches')
                .leftJoin('branches', 'userInBranches.branchId', 'branches.id')
                .where('userInBranches.userId', req.user.id)
        }))
        .asEnumerable()
        .select(function (item) {
            return {
                id: item.id,
                name: item.name,
                logo: '/uploads/;/{0}'.format(item.logo)
            };
        }).toArray();

    res.json(branches);
}));

router.route('/members').get(function (req, res) {
    knexService.select(
        knexService.raw('"userInBranches"."id" as "id"'),
        knexService.raw('"userInBranches"."state" as "state"'),
        knexService.raw('"users"."id" as "userId"'),
        knexService.raw('"users"."name" as "userName"'),
        knexService.raw('"users"."email" as "userEmail"')
    )
        .from('userInBranches')
        .leftJoin('users', 'userInBranches.userId', 'users.id')
        .where('branchId', req.cookies['branch-id'])
        .then(function (result) {
            res.json(result)
        });
});
router.route('/members/add').post(async(function (req, res) {
    let userId = req.body.userId,
        branchId = req.cookies['branch-id'],
        errors = [],
        isUserExistInBranch = await(knexService.where('userId', userId).first());

    if (isUserExistInBranch)
        errors.push('User is already exist in current branch');

    if (errors.length != 0)
        return res.json({isValid: false, errors: errors});

    let entity = {
        branchId: branchId,
        userId: req.body.userId,
        app: 'accounting',
        state: 'active'
    };

    await(knexService('userInBranches').insert(entity));
    res.json({isValid: true});
}));

router.route('/members/change-state/:id').put(async(function (req, res) {
    let id = req.params.id,
        member = await(knexService.table('userInBranches').where('id', id).first());

    if (member.state == 'active') member.state = 'inactive';
    else if (member.state == 'inactive') member.state = 'active';

    await(knexService('userInBranches').where('id', id).update(member));

    res.json({isValid: true});
}));

router.route('/:id/logo').get(async((req, res) => {
    let branch = await(knexService.select('logo').from('branches').where('id', req.params.id).first()),
        logo = '/uploads/;/{0}'.format(branch.logo),
        options = {
            root: config.rootPath,
            headers: {
                'Content-Type': 'image/png'
            }
        };

    res.sendFile(logo, options);
}));

router.route('/:id').get((req, res) => {
    knexService.select('id', 'name', 'logo').from('branches')
        .where('id', req.params.id).first()
        .then(branch => res.json(branch));
});

module.exports = router;