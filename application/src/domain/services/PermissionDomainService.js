import {inject, injectable} from "inversify";
import {PermissionRepository} from "../data/repository.permission";


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

        this.permissionRepository.createRole(role);
        return role.id;
    }

    createUserPermissions(userId, cmd) {
        let entity = {};
        entity.userInRole = this._userInRole(userId, cmd);
        entity.userPermissions = this._userPermissions(userId, cmd);
        entity.rolePermissions = this._rolePermissions(cmd);

        this.permissionRepository.create(entity);
        return entity.userPermissions.id;
    }

    _userInRole(userId, cmd) {
        let entity = {
                roleId: cmd.roleId,
                userId: userId
            },
            role = entity.roleId && this.permissionRepository.findRoleById(entity.roleId),
            user = entity.userId && this.permissionRepository.findUserById(entity.userId),
            errors = [];

        role && Object.keys(role).length === 0 && errors.push('نقش موردنظر وجود ندارد!');
        user && Object.keys(user).length === 0 && errors.push('کاربر موردنظر معتبر نمی باشد!');
        user && user.state !== 'active' && errors.push('کاربر موردنظر فعال نمی باشد!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        return entity;
    }

    _userPermissions(userId, cmd) {
        let role = cmd.roleId && this.permissionRepository.findRoleById(cmd.roleId),
            admin = role && role.isAdmin,
            entity = {
                userId: userId,
                permissions: !admin ? JSON.stringify(cmd.permissions) : null
            },
            user = entity.userId && this.permissionRepository.findUserById(entity.userId),
            userPermission = entity.userId
                && this.permissionRepository.findUserPermissionsByUserId(entity.userId),
            errors = [];

        user && Object.keys(user).length === 0
        && errors.push('کاربر موردنظر معتبر نمی باشد!');

        userPermission && Object.keys(userPermission).length !== 0
        && errors.push('برای کاربر {0} نقش و دسترسی تعریف شده است'.format(user.name));

        if (errors.length > 0)
            throw new ValidationException(errors);

        return entity;
    }

    _rolePermissions(cmd) {
        let entity = {
                roleId: cmd.roleId || null,
                permissions: Array.isArray(cmd.permissions) ? JSON.stringify(cmd.permissions) : null
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
        let entity = {},
            rolePermission = this.permissionRepository.findRolePermissionByRoleId(id),
            users = this.permissionRepository.findUsersInRoleByRoleId(id);

        entity.role.title = cmd.title || null;
        entity.rolePermissions = rolePermission;
        entity.rolePermissions.permissions = cmd.permissions || rolePermission.permissions;
        entity.rolePermissions.permissions = JSON.stringify(entity.rolePermissions.permissions);

        entity.usersInRole = users;

        return this.permissionRepository.updateRole(id, entity);
    }

    updateUserPermission(id, cmd) {

    }

    removeRole(id) {
        let users = this.permissionRepository.findUsersInRoleByRoleId(id);
        if (users.length > 0)
            throw new ValidationException(['این نقش به کاربر داده شده و امکان حذف وجود ندارد!']);

        return this.permissionRepository.removeRole(id);
    }
}