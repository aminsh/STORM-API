import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/permissions", "ShouldHaveBranch")
class PermissionController {

    @inject("PermissionQuery")
    /**@type{PermissionQuery}*/ permissionQuery = undefined;

    @inject("PermissionService")
    /**@type{PermissionService}*/ permissionService = undefined;


    @Get("/roles")
    @async()
    getAllRoles() {

        return this.permissionQuery.getAllRoles();
    }

    @Post("/roles")
    @async()
    createRole(req) {

        const object = this.permissionService.createRole(req.body);

        return {id: object.id, permissions: object.permissions};
    }

    @Get("/roles/:id")
    @async()
    getRoleById(req) {

        return this.permissionQuery.getRoleById(req.params.id);
    }

    @Put("/roles/:id")
    @async()
    updateRole(req) {

        this.permissionService.updateRole(req.params.id, req.body);
    }

    @Delete("/roles/:id")
    @async()
    removeRole(req) {

        this.permissionService.removeRole(req.params.id);
    }

    @Get("/users")
    @async()
    getUsersWithPermissions() {

        return this.permissionQuery.getUsersWithPermissions()
    }

    @Get("/users/:id")
    @async()
    getUserWithPermissions(req) {

        return this.permissionQuery.getUserWithPermissions(req.params.id);
    }

    @Post("/users/:id/add-role")
    @async()
    createUserPermissions(req) {

        const role = this.permissionService.createUserPermissions(req.params.id, req.body);

        return role;
    }

    @Post("/users/:id/edit-role")
    @async()
    updateUserPermission(req) {

        this.permissionService.updateUserPermission(req.params.id, req.body);
    }


    @Delete("/users/:id/remove-role")
    @async()
    removeUserPermissions(req) {

        this.permissionService.removeUserPermissions(req.params.id);
    }
}