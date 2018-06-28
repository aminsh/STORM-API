import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/scales", "ShouldHaveBranch")
class ScaleController {

    @inject("ScaleQuery")
    /**@type {ScaleQuery}*/ scaleQuery = undefined;

    @inject("ScaleService")
    /**@type {ScaleService}*/ scaleService = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.scaleQuery.getAll(req.query);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.scaleService.create(req.body);

        return this.scaleQuery.getById(id);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.scaleQuery.getById(req.params.id);
    }

    @Put("/:id")
    @async()
    update(req) {

        this.scaleService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.scaleService.remove(req.params.id);
    }

}