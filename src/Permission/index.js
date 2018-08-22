import {PermissionQuery} from "./PermissionQuery";
import {PermissionService} from "./PermissionService";
import {PermissionRepository} from "./PermissionRepository";
import {UserPermissionsControlService} from "./UserPermissionsControlService";

import "./PermissionController";


export function register(container) {

    container.bind("PermissionQuery").to(PermissionQuery);
    container.bind("PermissionService").to(PermissionService);
    container.bind("PermissionRepository").to(PermissionRepository);
    container.bind("UserPermissionsControlService").to(UserPermissionsControlService);
}