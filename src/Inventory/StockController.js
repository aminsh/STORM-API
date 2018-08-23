import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/stocks", "ShouldHaveBranch")
class StockController {

    @inject("StockService")
    /**@type{StockService}*/ stockService = undefined;

    @inject("StockQuery")
    /**@type{StockQuery}*/ stockQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.stockQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.stockQuery.getById(req.params.id);
    }

    @Post("/")
    create(req) {

        const id = this.stockService.create(req.body);

        return this.stockQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.stockService.update(id, req.body);

        return this.stockQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.stockService.remove(req.params.id);
    }
}