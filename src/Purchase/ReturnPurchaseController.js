import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/return-purchases", "ShouldHaveBranch")
class ReturnPurchaseController {

    @inject("ReturnPurchaseService")
    /** @type{ReturnPurchaseService}*/ returnPurchaseService = undefined;

    @inject("ReturnPurchaseQuery")
    /** @type{ReturnPurchaseQuery}*/ returnPurchaseQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.returnPurchaseQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.returnPurchaseQuery.getById(req.params.id);
    }

    @Get("/:id/compare-changes-invoice")
    compareChangesLines(req) {

        return this.returnPurchaseQuery.getCompareInvoiceOnChange(req.params.id, req.query.lines);
    }

    @Get("/max/number")
    maxNumber() {

        const result = this.returnPurchaseQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    create(req) {

        const id = this.returnPurchaseService.create(req.body);

        return this.returnPurchaseQuery.getById(id);
    }

    @Post("/:id/confirm")
    confirm(req) {

        const id = req.params.id;

        this.returnPurchaseService.confirm(id);

        return this.returnPurchaseQuery.getById(id);
    }

    @Post("/:id/fix")
    fix(req) {

        const id = req.params.id;

        this.returnPurchaseService.fix(id);

        return this.returnPurchaseQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.returnPurchaseService.update(id, req.body);

        return this.returnPurchaseQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.returnPurchaseService.remove(req.params.id);
    }
}