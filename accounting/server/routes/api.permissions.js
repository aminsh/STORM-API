"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    PermissionQuery = require('../queries/query.permissions');

router.route('/roles')
    .get(async((req, res) => {
        let permissionQuery = new PermissionQuery(req.branchId, req.user.id),
            result = await(permissionQuery.getAllRoles());
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("createRole", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/roles/:id')
    .get(async((req, res) => {
        let permissionQuery = new PermissionQuery(req.branchId, req.user.id),
            result = await(permissionQuery.getRoleById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("updateRole", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("removeRole", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/users')
    .get(async((req, res) => {
        let permissionQuery = new PermissionQuery(req.branchId, req.user.id),
            result = await(permissionQuery.getUsersWithPermissions());
        res.json(result);
    }));

router.route('/users/:id')
    .get(async((req, res) => {
        let permissionQuery = new PermissionQuery(req.branchId, req.user.id),
            result = await(permissionQuery.getUserWithPermissions(req.params.id));
        res.json(result);
    }));

router.route('/users/:id/add-role')
    .post(async((req, res) => {
        try {
            const userPermissionId = req.container.get("CommandBus").send("createUserPermissions", [req.params.id, req.body]);
            res.json({isValid: true, returnValue: {userPermissionId}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/users/:id/edit-role')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("updateUserPermission", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/users/:id/remove-role')
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;