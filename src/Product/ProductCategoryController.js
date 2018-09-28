import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/product-categories", "ShouldHaveBranch")
class ProductCategoryController {

    @inject("ProductCategoryQuery")
    /**@type {ProductCategoryQuery}*/ productCategoryQuery = undefined;

    @inject("ProductCategoryService")
    /**@type {ProductCategoryService}*/ productCategoryService = undefined;

    @Get("/")
    getAll(req) {

        return this.productCategoryQuery.getAll(req.query);
    }

    @Post("/")
    create(req) {

        const id = this.productCategoryService.create(req.body);

        return this.productCategoryQuery.getById(id);
    }

    @Get("/:id")
    getById(req) {

        return this.productCategoryQuery.getById(req.params.id);
    }

    @Put("/:id")
    update(req) {

        this.productCategoryService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.productCategoryService.remove(req.params.id);
    }

}