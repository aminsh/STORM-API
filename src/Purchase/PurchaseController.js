import { Controller, Delete, Get, Post, Put } from "../Infrastructure/expressUtlis";
import { inject } from "inversify";

@Controller("/v1/purchases", "ShouldHaveBranch")
class PurchaseController {

    @inject("PurchaseService")
    /** @type{PurchaseService}*/ purchaseService = undefined;

    @inject("PurchaseQuery")
    /** @type{PurchaseQuery}*/ purchaseQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.purchaseQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.purchaseQuery.getById(req.params.id);
    }

    @Get("/max/number")
    maxNumber() {

        const result = this.purchaseQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    create(req) {

        const id = this.purchaseService.create(req.body);

        if (req.body.status === 'confirm')
            this.purchaseService.confirm(id);

        return this.purchaseQuery.getById(id);
    }

    @Post("/:id/confirm")
    confirm(req) {

        const id = req.params.id;

        this.purchaseService.confirm(id);

        return this.purchaseQuery.getById(id);
    }

    @Post("/:id/fix")
    fix(req) {

        const id = req.params.id;

        this.purchaseService.fix(id);

        return this.purchaseQuery.getById(id);
    }

    @Put("/:id")
    update(req) {
        const id = req.params.id,
            before = this.purchaseQuery.getById(id);

        this.purchaseService.update(id, req.body);

        if (req.body.status === 'confirmed' && before.status === 'draft')
            this.purchaseService.confirm(id);

        return this.purchaseQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.purchaseService.remove(req.params.id);
    }

}