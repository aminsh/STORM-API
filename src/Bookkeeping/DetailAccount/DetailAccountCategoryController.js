import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/detail-account-categories", "ShouldHaveBranch")
class DetailAccountCategoryController {

    @inject("DetailAccountCategoryQuery")
    /**@type{DetailAccountCategoryQuery}*/ detailAccountCategoryQuery = undefined;

    @inject("DetailAccountCategoryService")
    /**@type{DetailAccountCategoryService}*/ detailAccountCategoryService = undefined;

    @Get("/")
    getAll(req) {

        return this.detailAccountCategoryQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.detailAccountCategoryQuery.getById(req.params.id);
    }

    @Post("/")
    create(req) {

        const id = this.detailAccountCategoryService.create(req.body);

        return this.detailAccountCategoryQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.detailAccountCategoryService.update(id, req.body);

        return this.detailAccountCategoryQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.detailAccountCategoryService.remove(req.params.id);
    }
}