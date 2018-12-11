import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/price-list", "ShouldHaveBranch")
class PriceListController {

    @inject("ProductCategoryQuery")
    /**@type {ProductCategoryQuery}*/ productCategoryQuery = undefined;

    @inject("PriceListService")
    /**@type {PriceListService}*/ priceListService = undefined;

    @inject("PriceListQuery")
    /**@type{PriceListQuery}*/ priceListQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.priceListQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.priceListQuery.getById(req.params.id);
    }

    @Get("/:id/lines")
    getLines(req) {

        return this.priceListQuery.getLines(req.params.id, req.query);
    }

    @Get("/by-product/:productId")
    getByProduct(req) {

        return this.priceListQuery.getByProduct(req.params.productId);

    }

    @Post("/")
    create(req) {

        const id = this.priceListService.create(req.body);

        return this.priceListQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.priceListService.update(req.params.id, req.body);

        return this.priceListQuery.getById(id);

    }

    @Delete("/:id")
    remove(req) {

        this.priceListService.remove(req.params.id);
    }

    @Post("/:id/product/:productId")
    updatePrice(req) {

        const cmd = {price: req.body.price, productId: req.params.productId};

        this.priceListService.updateProduct(req.params.id, cmd);
    }

}