var express = require('express'),
    router = express.Router(),
    guid = require('../utilities/guidService'),
    db = require('../models'),
    knexService = require('../services/knexService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = require('../config');

router.route('/').post(function (req, res) {
    var errors = [],
        cmd = req.body;

    var entity = {
        id: guid.newGuid(),
        name: cmd.name,
        logo: cmd.logo,
        phone: cmd.phone,
        address: cmd.address,
        ownerId: req.user.id
    };

    db.branch.create(entity)
        .then(function () {
            res.json({isValid: true, returnValue: entity.id});
        });
});

router.route('/my').get(async(function (req, res) {
    "use strict";

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
    var userId = req.body.userId,
        branchId = req.cookies['branch-id'],
        errors = [];

    var isUserExistInBranch = await(db.userInBranch.findOne({
        where: {userId: userId, branchId: branchId}
    }));

    if (isUserExistInBranch)
        errors.push('User is already exist in current branch');

    if (errors.length != 0)
        return res.json({isValid: false, errors: errors});

    var entity = {
        branchId: branchId,
        userId: req.body.userId,
        app: 'accounting',
        state: 'active'
    };

    await(db.userInBranch.create(entity));

    res.json({isValid: true});
}));

router.route('/members/change-state/:memberId').put(async(function (req, res) {
    var member = await(db.userInBranch.findById(req.params.memberId));

    if (member.state == 'active') member.state = 'inactive';
    else if (member.state == 'inactive') member.state = 'active';

    await(member.save());

    res.json({isValid: true});
}));

router.route('/:id/logo').get(async((req, res)=> {
    var branch = await(knexService
        .select('logo')
        .from('branches').where('id', req.params.id))[0],
        logo = '/uploads/;/{0}'.format(branch.logo),
        options = {
            root: config.rootPath,
            headers: {
                'Content-Type': 'image/png'
            }
        };

    res.sendFile(logo, options);
}));

module.exports = router;