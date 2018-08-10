import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/purchases", "ShouldHaveBranch")
class PurchaseController {

    @inject("PurchaseService")
    /** @type{PurchaseService}*/ purchaseService = undefined;

    @inject("PurchaseQuery")
    /** @type{PurchaseQuery}*/ purchaseQuery = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.purchaseQuery.getAll(req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.purchaseQuery.getById(req.params.id);
    }

    @Get("/max/number")
    @async()
    maxNumber() {

        const result = this.purchaseQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.purchaseService.create(req.body);

        return this.purchaseQuery.getById(id);
    }

    @Post("/:id/confirm")
    @async()
    confirm(req) {

        const id = req.params.id;

        this.purchaseService.confirm(id);

        return this.purchaseQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        const id = req.params.id;

        this.purchaseService.update(id, req.body);

        return this.purchaseQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.purchaseService.remove(req.params.id);
    }
}