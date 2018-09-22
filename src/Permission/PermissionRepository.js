import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class PermissionRepository extends BaseRepository {

    findRoleById(id) {
        return toResult(this.knex.select()
            .from('roles')
            .where('id', id)
            .first());
    }

    findRolesByTitle(title) {
        let rolesTitle = toResult(this.knex.select('title')
            .from('roles')
            .modify(this.modify, this.branchId, 'roles.branchId'));

        rolesTitle && rolesTitle.forEach(rt => rt.title = rt.title.replace(/\s/g, ''));
        title = title.replace(/\s/g, '');
        return rolesTitle.asEnumerable().where(item => item.title === title).toArray();
    }

    findUsersInRoleByRoleId(id) {
        return toResult(this.knex.select()
            .from('userInRole')
            .modify(this.modify, this.branchId, 'userInRole.branchId')
            .where('roleId', id)
        )
    }

    findRolePermissionByRoleId(id) {
        return toResult(this.knex.select()
            .from('rolePermissions')
            .modify(this.modify, this.branchId, 'rolePermissions.branchId')
            .where('roleId', id)
            .first()
        )
    }

    findUserById(id) {
        return toResult(this.knex.select()
            .from('users')
            .where('id', id)
            .first());
    }

    findUserPermissionsByUserId(id) {
        return toResult(this.knex.select()
            .from('userPermissions')
            .where('userId', id)
            .modify(this.modify, this.branchId)
            .first());
    }

    findUserInRoleByUserId(id) {
        return toResult(this.knex.select()
            .from('userInRole')
            .where('userId', id)
            .where('branchId', this.branchId)
            .first());
    }

    create(entity) {
        let trx = this.transaction;
        try {
            toResult(this.createUserInRole(entity.userInRole, trx));
            toResult(this.createUserPermissions(entity.userPermissions, trx));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    createUserInRole(entity) {
        super.create(entity);
        toResult(this.knex('userInRole').insert(entity));
        return entity;
    }

    createUserPermissions(entity, trx) {
        super.create(entity);
        toResult(trx('userPermissions').insert(entity));
        return entity;
    }

    createRolePermissions(entity, trx) {
        super.create(entity);
        toResult(trx('rolePermissions').insert(entity));
        return entity;
    }

    createRole(role) {
        let trx = this.transaction;
        try {
            let permissions = role.permissions;
            delete role.permissions;

            super.create(role);
            toResult(trx('roles').insert(role));

            let rolePermissions = {
                roleId: role.id,
                permissions: permissions
            };
            this.createRolePermissions(rolePermissions, trx);

            role.permissions = permissions;
            trx.commit();
            return role;
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    removeRole(id) {
        let trx = this.transaction,
            rolePermissions = this.findRolePermissionByRoleId(id);
        try {
            rolePermissions && toResult(this.removeRolePermissions(rolePermissions.id, trx));
            toResult(trx('roles').where('id', id).del());
            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    removeRolePermissions(id, trx) {
        return toResult(trx('rolePermissions').where('id', id).del());
    }

    removeUserRolePermissions(id) {
        let trx = this.transaction;
        try {
            let userInRole = this.findUserInRoleByUserId(id),
                userPermissions = this.findUserPermissionsByUserId(id);

            toResult(trx('userInRole')
                .where('id', userInRole.id)
                .where('branchId', this.branchId)
                .del());

            userPermissions && toResult(trx('userPermissions')
                .where('id', userPermissions.id)
                .where('branchId', this.branchId)
                .del());

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    updateRole(id, entity) {
        let trx = this.transaction;
        try {
            if (entity.role.title)
                toResult(trx('roles').where('id', id)
                    .modify(this.modify, this.branchId)
                    .update({title: entity.role.title}));

            if (entity.rolePermissions)
                toResult(this.updateRolePermission(trx, entity.rolePermissions.id,
                    {permissions: entity.rolePermissions.permissions}));

            if (entity.userPermissions)
                entity.userPermissions.forEach(item =>
                    toResult(this.updateUserPermissions(trx, item.id, {permissions: JSON.stringify(item.permissions)})));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    updateRolePermission(trx, id, entity) {
        return toResult(this.knex('rolePermissions').where('id', id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    updateUserPermissions(trx, id, entity) {
        return toResult(trx('userPermissions').where('id', id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    updateUserRoleAndPermissions(entity) {
        let trx = this.transaction;
        try {
            toResult(trx('userInRole').where('id', entity.userInRole.id)
                .modify(this.modify, this.branchId)
                .update({roleId: entity.userInRole.roleId}));

            toResult(trx('userPermissions').where('id', entity.userPermission.id)
                .modify(this.modify, this.branchId)
                .update({permissions: entity.userPermission.permissions}));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }
}