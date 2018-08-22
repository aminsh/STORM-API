import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/people", "ShouldHaveBranch")
class PersonController {

    @inject("PersonQuery")
    /** @type{PersonQuery}*/ personQuery = undefined;

    @inject("PersonService")
    /** @type {PersonService}*/ personService = undefined;

    @Get("/")
    @async()
    getAll(req) {
        return this.personQuery.getAll(req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {
        return this.personQuery.getById(req.params.id);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.personService.create(req.body);

        return this.personQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {
        const id = req.params.id;

        this.personService.update(id, req.body);

        return this.personQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.personService.remove(req.params.id);
    }
}