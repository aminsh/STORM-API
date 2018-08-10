import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/sales", "ShouldHaveBranch")
class SaleController {

    @inject("SaleService")
    /** @type{SaleService}*/ saleService = undefined;

    @inject("SaleQuery")
    /** @type{SaleQuery}*/ saleQuery = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.saleQuery.getAll(req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.saleQuery.getById(req.params.id);
    }

    @Get("/:id/compare-changes-invoice")
    @async()
    compareChangesLines(req) {

        return this.saleQuery.getCompareInvoiceOnChange(req.params.id, req.query.lines);
    }

    @Get("/max/number")
    @async()
    maxNumber() {

        const result = this.saleQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.saleService.create(req.body);

        return this.saleQuery.getById(id);
    }

    @Post("/:id/confirm")
    @async()
    confirm(req) {

        const id = req.params.id;

        this.saleService.confirm(id);

        return this.saleQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        const id = req.params.id;

        this.saleService.update(id, req.body);

        return this.saleQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.saleService.remove(req.params.id);
    }
}