import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/people", "ShouldHaveBranch")
class PersonController {

    @inject("PersonQuery")
    /** @type{PersonQuery}*/ personQuery = undefined;

    @inject("PersonService")
    /** @type {PersonService}*/ personService = undefined;

    @Get("/")
    getAll(req) {
        return this.personQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.personQuery.getById(req.params.id);
    }

    @Get("/role/:personRole")
    getAllByRole(req){

        return this.personQuery.getAllPeopleWithRoleFilter(req.query, req.params.personRole);
    }

    @Post("/")
    create(req) {

        const id = this.personService.create(req.body);

        return this.personQuery.getById(id);
    }

    @Put("/:id")
    update(req) {
        const id = req.params.id;

        this.personService.update(id, req.body);

        return this.personQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.personService.remove(req.params.id);
    }
}