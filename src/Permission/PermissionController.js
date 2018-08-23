import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/permissions", "ShouldHaveBranch")
class PermissionController {

    @inject("PermissionQuery")
    /**@type{PermissionQuery}*/ permissionQuery = undefined;

    @inject("PermissionService")
    /**@type{PermissionService}*/ permissionService = undefined;


    @Get("/roles")
    getAllRoles() {

        return this.permissionQuery.getAllRoles();
    }

    @Post("/roles")
    createRole(req) {

        const object = this.permissionService.createRole(req.body);

        return {id: object.id, permissions: object.permissions};
    }

    @Get("/roles/:id")
    getRoleById(req) {

        return this.permissionQuery.getRoleById(req.params.id);
    }

    @Put("/roles/:id")
    updateRole(req) {

        this.permissionService.updateRole(req.params.id, req.body);
    }

    @Delete("/roles/:id")
    removeRole(req) {

        this.permissionService.removeRole(req.params.id);
    }

    @Get("/users")
    getUsersWithPermissions() {

        return this.permissionQuery.getUsersWithPermissions()
    }

    @Get("/users/:id")
    getUserWithPermissions(req) {

        return this.permissionQuery.getUserWithPermissions(req.params.id);
    }

    @Post("/users/:id/add-role")
    createUserPermissions(req) {

        const role = this.permissionService.createUserPermissions(req.params.id, req.body);

        return role;
    }

    @Post("/users/:id/edit-role")
    updateUserPermission(req) {

        this.permissionService.updateUserPermission(req.params.id, req.body);
    }


    @Delete("/users/:id/remove-role")
    removeUserPermissions(req) {

        this.permissionService.removeUserPermissions(req.params.id);
    }
}