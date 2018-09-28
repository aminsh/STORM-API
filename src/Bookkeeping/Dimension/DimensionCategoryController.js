import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/dimension-categories", "ShouldHaveBranch")
class DimensionCategoryController {

    @inject("DimensionCategoryQuery")
    /** @type{DimensionCategoryQuery}*/ dimensionCategoryQuery = undefined;

    @inject("DimensionService")
    /** @type {DimensionService}*/ dimensionService = undefined;

    @Get("/")
    getAll(req) {

        return this.dimensionCategoryQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.dimensionCategoryQuery.getById(req.params.id);
    }

    @Post("/")
    create(req) {

        const id = this.dimensionService.createDimensionCategory(req.body);

        return this.dimensionCategoryQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.dimensionService.updateDimensionCategory(req.params.id, req.body);

        return this.dimensionCategoryQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.dimensionService.removeDimensionCategory(req.params.id);
    }
}

