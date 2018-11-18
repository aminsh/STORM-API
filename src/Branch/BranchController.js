import {inject} from "inversify";
import {Controller, Delete, Get, Post, Put, WithoutControlPermissions} from "../Infrastructure/expressUtlis";

@Controller("/v1/branches")
@WithoutControlPermissions()
class BranchController {

    @inject("BranchQuery")
    /** @type {BranchQuery} */ branchQuery = undefined;

    @inject("BranchService")
    /** @type {BranchService} */ branchService = undefined;

    @Get("/", "ShouldAuthenticated")
    getAll(req) {

        return this.branchQuery.find({userId: req.user.id});
    }

    @Get("/by-token/:token")
    getByToken(req) {

        let token = req.params.token,
            result = this.branchQuery.find({token}, true);

        if (!result)
            throw new NotFoundException();

        return result;
    }

    @Post("/", "ShouldAuthenticated")
    create(req) {

        let id = this.branchService.create(req.body, req.user.id),
            branch = this.branchQuery.find({id}, true);

        branch.isUsedTrialBefore = this.branchQuery.isUsedTrailBeforeByUser(branch.ownerId);

        return branch;
    }

    @Put("/:id", "ShouldAuthenticated")
    update(req) {

        let id = req.params.id;

        this.branchService.update(id, req.body);
    }

    @Delete("/:id", "ShouldAuthenticated")
    archive(req) {

        let id = req.params.id;

        this.branchService.archive(id);
    }

    @Get("/:id/users", "ShouldHaveBranch")
    getMembers(req) {

        return this.branchQuery.getMembers(req.params.id, req.query);
    }

    @Post("/:id/users", "ShouldAuthenticated")
    addUser(req) {

        let id = req.params.id;

        this.branchService.addUserByEmailOrMobile(id, req.body);
    }

    @Delete("/:id/users/:userId", "ShouldAuthenticated")
    removeUser(req) {

        let id = req.params.id;

        this.branchService.removeUser(req.params.id, req.params.userId);
    }

    @Put("/:id/users/:userId/regenerate-token", "ShouldAuthenticated")
    regenerateToken(req) {

        this.branchService.regenerateMemberToken(req.params.id, req.params.userId);
    }
}