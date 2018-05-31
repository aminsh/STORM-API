import {inject, injectable} from "inversify";
import flatten from "flat";
import renameKeys from "rename-keys";

@injectable()
export class UserPermissionsControlDomainService {

    /** @type {PermissionRepository}*/
    @inject("PermissionRepository") permissionRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    controlPermission(request) {
        let userId = this.state.user.id,
            userPermissions = this.permissionRepository.findUserPermissionsByUserId(userId),
            existsPermission = userPermissions
                && userPermissions.permissions
                && this._existsPermission(request, userPermissions.permissions);

        if (!existsPermission) return true;

        let havePermissions = this._haveUserPermissions(userPermissions.permissions, request);

        return havePermissions;
    }

    _existsPermission(request, userPermissions) {
        let flatPermissions = flatten(userPermissions),
            permissions = renameKeys(flatPermissions, function (key, val) {
                return key.substring(2);
            }),
            exists = permissions && Object.keys(permissions).asEnumerable()
                .where(key => key === request).toArray();
        return exists.length !== 0;
    }

    _haveUserPermissions(userPermissions, request) {
        let flatPermissions = flatten(userPermissions),
            permissions = renameKeys(flatPermissions, function (key, val) {
                return key.substring(2);
            });
        return permissions[request];
    }

}