import {inject, injectable} from "inversify";
import {PermissionRepository} from "../data/repository.permission";
import permissions from "../../../../accounting/server/config/settings/permisions";


@injectable()

export class PermissionDomainService {

    /**@type {PermissionRepository}*/
    @inject("PermissionRepository") permissionRepository = undefined;

    createRole(cmd) {
        let role = {
                title: cmd.title,
                isAdmin: false
            },
            existentRole = role.title && this.permissionRepository.findRolesByTitle(role.title),
            errors = [];

        if (Utility.String.isNullOrEmpty(role.title))
            errors.push('عنوان نقش نمی تواند خالی باشد!');
        else if (role.title.length < 3)
            errors.push('عنوان نمی تواند کمتر از 3حرف باشد!');

        existentRole.length > 0 && errors.push('نقش با نام {0} قبلا تعریف شده است!'.format(role.title));

        if (errors.length > 0)
            throw new ValidationException(errors);

        let rolePermission = cmd.permissions || permissions;
        role.permissions = JSON.stringify(rolePermission);
        this.permissionRepository.createRole(role);
        return {id: role.id, permissions: rolePermission};
    }

    createUserPermissions(userId, cmd) {
        let entity = {
            userInRole: {},
            userPermissions: {}
        },
            role = cmd.roleId ? this.permissionRepository.findRoleById(cmd.roleId) : null;
        entity.userInRole = this._userInRole(userId, cmd);
        entity.userPermissions = this._userPermissions(userId, cmd);

        this.permissionRepository.create(entity);
        return role ? role.title : null;
    }

    _userInRole(userId, cmd) {
        let entity = {
                roleId: cmd.roleId,
                userId: userId
            },
            role = entity.roleId ? this.permissionRepository.findRoleById(entity.roleId) : null,
            user = entity.userId ? this.permissionRepository.findUserById(entity.userId) : null,
            errors = [];

        if (!role)
            errors.push('نقش موردنظر وجود ندارد!');
        if (!user)
            errors.push('کاربر موردنظر معتبر نمی باشد!');
        else if (user && user.state !== 'active')
            errors.push('کاربر موردنظر فعال نمی باشد!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        return entity;
    }

    _userPermissions(userId, cmd) {
        let role = cmd.roleId ? this.permissionRepository.findRoleById(cmd.roleId) : null,
            rolePermission = cmd.roleId
                ? this.permissionRepository.findRolePermissionByRoleId(cmd.roleId)
                : null,

            admin = role ? role.isAdmin : false,
            permission = cmd.permissions
                ? cmd.permissions.length === 0
                    ? rolePermission ? rolePermission.permissions : null
                    : cmd.permissions
                : rolePermission ? rolePermission.permissions : null,

            entity = {
                userId: userId,
                permissions: !admin
                    ? permission ? JSON.stringify(permission) : null
                    : null
            },
            user = entity.userId ? this.permissionRepository.findUserById(entity.userId) : null,
            userPermission = entity.userId
                ? this.permissionRepository.findUserPermissionsByUserId(entity.userId)
                : null,
            errors = [];

        if (!user)
            errors.push('کاربر موردنظر معتبر نمی باشد!');
        else if (userPermission)
            errors.push('برای کاربر {0} نقش و دسترسی تعریف شده است'.format(user.name));

        if (errors.length > 0)
            throw new ValidationException(errors);

        return entity;
    }

    _rolePermissions(cmd) {
        let entity = {
                roleId: cmd.roleId || null,
                permissions: Array.isArray(cmd.permissions) ? JSON.stringify(cmd.permissions) : []
            },
            role = entity.roleId && this.permissionRepository.findRoleById(entity.roleId),
            rolePermission = entity.roleId && this.permissionRepository.findRolePermissionByRoleId(entity.roleId),
            errors = [];

        role && Object.keys(role).length === 0 && errors.push('نقش موردنظر وجود ندارد!');
        if (errors.length > 0)
            throw new ValidationException(errors);

        return rolePermission ? null : entity;
    }

    updateRole(id, cmd) {
        let entity = {
                role: {},
                rolePermissions: {},
                userPermissions: {}
            },
            role = this.permissionRepository.findRoleById(id),
            rolePermission = this.permissionRepository.findRolePermissionByRoleId(id),
            usersInRole = this.permissionRepository.findUsersInRoleByRoleId(id),
            usersId = usersInRole.asEnumerable().select(item => item.userId).toArray();

        entity.role.title = cmd.title || role.title;
        entity.rolePermissions = rolePermission;
        entity.rolePermissions.permissions = cmd.permissions || rolePermission.permissions;
        entity.rolePermissions.permissions = JSON.stringify(entity.rolePermissions.permissions);

        entity.userPermissions = usersId.asEnumerable()
            .select(item => this.permissionRepository.findUserPermissionsByUserId(item)).toArray();

        entity.userPermissions = entity.userPermissions.asEnumerable()
            .select(up => ({
                id: up.id,
                permissions: cmd.permissions || up.permissions
            })).toArray();

        return this.permissionRepository.updateRole(id, entity);
    }

    updateUserPermission(id, cmd) {
        let userInRole = this.permissionRepository.findUserInRoleByUserId(id),
            userPermission = this.permissionRepository.findUserPermissionsByUserId(id),
            role = cmd.roleId ? this.permissionRepository.findRoleById(cmd.roleId) : null,
            admin = role ? role.isAdmin : false;

        if (!userInRole || !userPermission)
            throw new ValidationException(['برای کاربر دسترسی ایجاد نشده است!']);

        let permission = cmd.permissions
            ? cmd.permissions.length === 0
                ? userPermission.permissions
                : cmd.permissions
            : userPermission.permissions,

            entity = {
                userInRole: {
                    id: userInRole.id,
                    roleId: cmd.roleId || userInRole.roleId
                },
                userPermission: {
                    id: userPermission.id,
                    permissions: !admin
                        ? permission
                            ? JSON.stringify(permission) : null
                        : null
                }
            };
        return this.permissionRepository.updateUserRoleAndPermissions(entity);

    }

    removeRole(id) {
        let users = this.permissionRepository.findUsersInRoleByRoleId(id);
        if (users.length > 0)
            throw new ValidationException(['این نقش به کاربر داده شده و امکان حذف وجود ندارد!']);

        return this.permissionRepository.removeRole(id);
    }

    removeUserPermissions(id) {
        this.permissionRepository.removeUserRolePermissions(id);
    }
}