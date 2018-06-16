import {inject} from "inversify";
import {async} from "../core/@decorators";
import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";

@Controller("/v1/branches")
class BranchController {

    @inject("BranchQuery")
    /** BranchQuery */ branchQuery = undefined;

    @inject("BranchService")
    /** BranchService */ branchService = undefined;

    @Get("/", "ShouldAuthenticated")
    @async()
    getAll(req) {

        return this.branchQuery.find({userId: req.user.id});
    }

    @Get("/by-token/:token")
    @async()
    getByToken(req, res) {
        
        let token = req.params.token,
            result = this.branchQuery.find({token}, true);

        if (!result)
            res.sendStatus(404);

        return result;
    }

    @Post("/", "ShouldAuthenticated")
    @async()
    create(req) {

        let id = this.branchService.create(req.body, req.user.id);

        return this.branchQuery.find({id}, true);
    }

    @Put("/:id", "ShouldAuthenticated")
    @async()
    update(req, res) {

        try {

            let id = req.params.id;

            this.branchService.update(id, req.body);

            return this.branchQuery.find({id}, true);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Get("/:id/users", "ShouldAuthenticated")
    @async()
    getMembers(req){

        return this.branchQuery.getMembers(req.params.id, req.query);
    }

    @Post("/:id/users", "ShouldAuthenticated")
    @async()
    addUser(req, res) {
        try {

            let id = req.params.id;

            this.branchService.addUser(id, req.body.userId);

        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Delete("/:id/users/:userId", "ShouldAuthenticated")
    @async()
    removeUser(req, res) {
        try {

            let id = req.params.id;

            this.branchService.removeUser(req.params.id, req.params.userId);

        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors[0]);

            res.sendStatus(500);
        }
    }

    @Put("/:id/users/:userId/regenerate-token", "ShouldAuthenticated")
    @async()
    regenerateToken(req) {

        this.branchService.regenerateMemberToken(req.params.id, req.params.userId);
    }
}