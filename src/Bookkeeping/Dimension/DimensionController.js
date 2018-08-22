import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {async} from "../../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/dimensions", "ShouldHaveBranch")
class DimensionController {

    @inject("DimensionQuery")
    /** @type{DimensionQuery}*/ dimensionQuery = undefined;

    @inject("DimensionService")
    /** @type {DimensionService}*/ dimensionService = undefined;

    @Get("/category/:categoryId")
    @async()
    getAll(req) {

        return this.dimensionQuery.getAll(req.params.categoryId, req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.dimensionQuery.getById(req.params.id);
    }

    @Post("/category/:categoryId")
    @async()
    create(req) {

        const id = this.dimensionService.createDimension(req.params.categoryId,req.body);

        return this.dimensionQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {
        const id = req.params.id;

        this.dimensionService.updateDimension(req.params.id, req.body);

        return this.dimensionQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.dimensionService.removeDimension(req.params.id);
    }
}

