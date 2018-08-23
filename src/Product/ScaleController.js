import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/scales", "ShouldHaveBranch")
class ScaleController {

    @inject("ScaleQuery")
    /**@type {ScaleQuery}*/ scaleQuery = undefined;

    @inject("ScaleService")
    /**@type {ScaleService}*/ scaleService = undefined;

    @Get("/")
    getAll(req) {

        return this.scaleQuery.getAll(req.query);
    }

    @Post("/")
    create(req) {

        const id = this.scaleService.create(req.body);

        return this.scaleQuery.getById(id);
    }

    @Get("/:id")
    getById(req) {

        return this.scaleQuery.getById(req.params.id);
    }

    @Put("/:id")
    update(req) {

        this.scaleService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.scaleService.remove(req.params.id);
    }

}