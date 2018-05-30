"use strict";

const BaseQuery = require('./query.base');

class PermissionsQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getAdminId() {
        let knex = this.knex;
        return this.await(knex.select('id')
            .from('roles')
            .where('isAdmin', true)
            .first())
            .id;
    }

    getAllRoles() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            adminId = this.getAdminId(),

            roles = this.await(knex.select('title', 'id')
                .from('roles')
                .modify(this.modify, branchId, userId, canView)
                .orWhere('isAdmin', true)
            );
        roles = !canView
            ? roles.asEnumerable().where(role => role.id !== adminId).toArray()
            : roles;

        let roleIds = roles.asEnumerable().select(item => item.id).toArray(),
            users = this.await(knex.select('users.id', 'users.name', 'users.email', 'roleId')
                .from('users')
                .innerJoin('userInRole', 'users.id', 'userInRole.userId')
                .where('userInRole.branchId', branchId)
                .whereIn('userInRole.roleId', roleIds)
            ),
            permissions = this.await(knex.select('permissions', 'roleId')
                .from('rolePermissions')
                .where('rolePermissions.branchId', branchId)
                .whereIn('rolePermissions.roleId', roleIds));

        roles = roles.asEnumerable().select(item =>
            Object.assign({}, item, {
                users: users.asEnumerable().where(user => user.roleId === item.id).toArray(),
                permissions: permissions.asEnumerable()
                    .where(permission => permission.roleId === item.id)
                    .select(item => item.permissions).toArray()
            })).toArray();

        return roles;
    }

    getRoleById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),

            role = this.await(knex.select('title', 'id')
                .from('roles')
                .modify(this.modify, branchId, userId, canView)
                .where('id', id)
            );

        /*let users = this.await(knex.select('users.id', 'users.name', 'users.email', 'roleId')
                .from('users')
                .innerJoin('userInRole', 'users.id', 'userInRole.userId')
                .where('userInRole.branchId', branchId)
                .where('userInRole.roleId', id)
            ),*/
        let permissions = this.await(knex.select('permissions', 'roleId')
            .from('rolePermissions')
            .where('rolePermissions.branchId', branchId)
            .whereIn('rolePermissions.roleId', id));

        role = role.asEnumerable().select(item =>
            Object.assign({}, item, {
                //users: users.asEnumerable().where(user => user.roleId === item.id).toArray(),
                permissions: permissions.asEnumerable().where(permission => permission.roleId === item.id).toArray()
            })).toArray();

        return role;
    }

    getUsersWithPermissions() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView();

        return this.await(knex.select(
            'users.id',
            'users.name',
            'users.email',
            'userInRole.roleId',
            'roles.title',
            'users.state',
            'userPermissions.permissions'
        )
            .from('userInBranches')
            .innerJoin('users', 'userInBranches.userId', 'users.id')
            .leftJoin('userPermissions', function () {
                this.on(function () {
                    this.on('userPermissions.userId', '=', 'userInBranches.userId');
                    this.andOn('userInBranches.branchId', '=', 'userPermissions.branchId')
                })
            })
            .leftJoin('userInRole', function () {
                this.on(function () {
                    this.on('userInRole.userId', '=', 'userInBranches.userId');
                    this.andOn('userInBranches.branchId', '=', 'userInRole.branchId')
                })
            })
            .leftJoin('roles', 'roles.id', 'userInRole.roleId')
            .modify(this.modify, branchId, userId, canView, 'userInBranches'));
    }

    getUserWithPermissions(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView();

        return this.await(knex.select(
            'userPermissions.userId',
            'users.name',
            'users.email',
            'userInRole.roleId',
            'roles.title',
            'users.state',
            'userPermissions.permissions'
        )
            .from('userInBranches')
            .innerJoin('users', 'userInBranches.userId', 'users.id')
            .leftJoin('userPermissions', function () {
                this.on(function () {
                    this.on('userPermissions.userId', '=', 'userInBranches.userId');
                    this.andOn('userInBranches.branchId', '=', 'userPermissions.branchId')
                })
            })
            .leftJoin('userInRole', function () {
                this.on(function () {
                    this.on('userInRole.userId', '=', 'userInBranches.userId');
                    this.andOn('userInBranches.branchId', '=', 'userInRole.branchId')
                })
            })
            .leftJoin('roles', 'roles.id', 'userInRole.roleId')
            .modify(this.modify, branchId, userId, canView, 'userInBranches')
            .where('users.id', id));
    }

}

module.exports = PermissionsQuery;