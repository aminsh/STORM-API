import {inject} from "inversify";
import {async} from "../core/@decorators";
import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";

@Controller("/v1/branches")
class BranchController {

    @inject("BranchQuery")
    /** @type {BranchQuery} */ branchQuery = undefined;

    @inject("BranchService")
    /** @type {BranchService} */ branchService = undefined;

    @Get("/", "ShouldAuthenticated")
    @async()
    getAll(req) {

        return this.branchQuery.find({userId: req.user.id});
    }

    @Get("/by-token/:token")
    @async()
    getByToken(req) {
        
        let token = req.params.token,
            result = this.branchQuery.find({token}, true);

        if (!result)
            throw new NotFoundException();

        return result;
    }

    @Post("/", "ShouldAuthenticated")
    @async()
    create(req) {

        let id = this.branchService.create(req.body, req.user.id),
            branch = this.branchQuery.find({id}, true);

        branch.isUsedTrialBefore = this.branchQuery.isUsedTrailBeforeByUser(branch.ownerId);

        return branch;
    }

    @Put("/:id", "ShouldAuthenticated")
    @async()
    update(req) {

        let id = req.params.id;

        this.branchService.update(id, req.body);
    }

    @Get("/:id/users", "ShouldAuthenticated")
    @async()
    getMembers(req){

        return this.branchQuery.getMembers(req.params.id, req.query);
    }

    @Post("/:id/users", "ShouldAuthenticated")
    @async()
    addUser(req) {

        let id = req.params.id;

        this.branchService.addUser(id, req.body.userId);
    }

    @Delete("/:id/users/:userId", "ShouldAuthenticated")
    @async()
    removeUser(req) {

        let id = req.params.id;

        this.branchService.removeUser(req.params.id, req.params.userId);
    }

    @Put("/:id/users/:userId/regenerate-token", "ShouldAuthenticated")
    @async()
    regenerateToken(req) {

        this.branchService.regenerateMemberToken(req.params.id, req.params.userId);
    }
}