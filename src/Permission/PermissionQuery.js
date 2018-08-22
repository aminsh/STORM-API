import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify"
import Permissions from "./permisions.json";
import flatten from "flat";
import renameKeys from "rename-keys";


@injectable()
export class PermissionQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getAdminId() {
        let knex = this.knex;
        return toResult(knex.select('id')
            .from('roles')
            .where('isAdmin', true)
            .first())
            .id;
    }

    getAllRoles() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            adminId = this.getAdminId(),

            roles = toResult(knex.select('title', 'roles.id', 'permissions')
                .from('roles')
                .leftJoin('rolePermissions', 'roles.id', 'rolePermissions.roleId')
                .modify(this.modify, branchId, userId, canView, 'roles')
                .orWhere('isAdmin', true)
            );
        roles = !canView
            ? roles.asEnumerable().where(role => role.id !== adminId).toArray()
            : roles;

        let roleIds = roles.asEnumerable().select(item => item.id).toArray(),
            users = toResult(knex.select('users.id', 'users.name', 'users.email', 'roleId')
                .from('users')
                .innerJoin('userInRole', 'users.id', 'userInRole.userId')
                .where('userInRole.branchId', branchId)
                .whereIn('userInRole.roleId', roleIds)
            );


        roles = roles.asEnumerable().select(item =>
            Object.assign({}, item, {
                users: users.asEnumerable().where(user => user.roleId === item.id).toArray()
            })).toArray();

        return roles;
    }

    getRoleById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            canView = this.canView.call(this),

            role = toResult(knex.select('title', 'id')
                .from('roles')
                .where(canView)
                .where('id', id)
            );
        let rolePermissions = toResult(knex.select('permissions')
            .from('rolePermissions')
            .where('rolePermissions.branchId', branchId)
            .whereIn('rolePermissions.roleId', id)
            .first());

        rolePermissions = rolePermissions ? this._comparePermissions(rolePermissions.permissions) : null;

        role = role.asEnumerable().select(item =>
            Object.assign({}, item, {
                permissions: rolePermissions
            })).toArray();

        return role;
    }

    _comparePermissions(rolePermissions) {
        let flatPermissions = flatten(Permissions),
            flatRolePermissions = flatten(rolePermissions);

        flatPermissions = renameKeys(flatPermissions, function (key, val) {
            let firstDot = key.indexOf('.', 0);
            return key.substring(firstDot + 1);
        });
        flatRolePermissions = renameKeys(flatRolePermissions, function (key, val) {
            let firstDot = key.indexOf('.', 0);
            return key.substring(firstDot + 1);
        });

        let mergePermissions = Object.assign({}, flatPermissions, flatRolePermissions);
        mergePermissions = flatten.unflatten(mergePermissions);

        rolePermissions = Object.keys(mergePermissions).asEnumerable().select(item => ({
            [item]: mergePermissions[item]
        })).toArray();

        return rolePermissions;
    }

    getUsersWithPermissions() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this);

        return toResult(
            knex.select(
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
                .modify(this.modify, branchId, userId, canView, 'userInBranches')
        );
    }

    getUserWithPermissions(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this);

        return toResult(
            knex.select(
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
                .where('users.id', id)
                .first()
        );
    }

}
