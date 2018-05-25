import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class PermissionRepository extends BaseRepository {

    findRoleById(id) {
        return toResult(this.knex.select()
            .from('roles')
            .modify(this.modify, this.branchId, 'roles.branchId')
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

    findUserPermissionsByUserId(id){
        return toResult(this.knex.select('permissions')
            .from('userPermissions')
            .where('userId', id)
            .modify(this.modify, this.branchId, 'userPermissions.branchId')
            .first());
    }

    create(entity) {
        let trx = this.transaction;
        try {
            toResult(this.createUserInRole(entity.userInRole, trx));
            toResult(this.createUserPermissions(entity.userPermissions, trx));
            entity.rolePermissions && toResult(this.createRolePermissions(entity.rolePermissions, trx));

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
        super.create(role);
        toResult(this.knex('roles').insert(role));
        return role;
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

    updateRole(id, entity) {
        let trx = this.transaction;
        try {
            entity.role.title && toResult(trx('roles').where('id', id)
                .modify(this.modify, this.branchId)
                .update({title: entity.role.title}));

            entity.rolePermissions &&
                toResult(this.updateRolePermission(entity.rolePermissions.id, entity.rolePermissions));

            entity.usersInRole &&
                entity.usersInRole.users
                    .forEach(item => toResult(
                        this.updateRolePermission(item.id, {permissions:entity.rolePermissions.permissions})));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    updateRolePermission(id, entity) {
        return toResult(trx('rolePermissions').where('id', id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }

}