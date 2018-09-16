import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/sales", "ShouldHaveBranch")
class SaleController {

    @inject("SaleService")
    /** @type{SaleService}*/ saleService = undefined;

    @inject("SaleQuery")
    /** @type{SaleQuery}*/ saleQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.saleQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.saleQuery.getById(req.params.id);
    }

    @Get("/:id/compare-changes-invoice")
    compareChangesLines(req) {

        return this.saleQuery.getCompareInvoiceOnChange(req.params.id, req.query.lines);
    }

    @Get("/max/number")
    maxNumber() {

        const result = this.saleQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    create(req) {

        const id = this.saleService.create(req.body);

        return this.saleQuery.getById(id);
    }

    @Post("/:id/confirm")
    confirm(req) {

        const id = req.params.id;

        this.saleService.confirm(id);

        return this.saleQuery.getById(id);
    }

    @Post("/:id/fix")
    fix(req) {

        const id = req.params.id;

        this.saleService.fix(id);

        return this.saleQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.saleService.update(id, req.body);

        return this.saleQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.saleService.remove(req.params.id);
    }

    @Get("/summary")
    summary() {

        return this.saleQuery.getSummary();
    }

    @Get("/summary/by-month")
    summaryByMonth() {

        return this.saleQuery.getTotalByMonth();
    }

    @Get("/summary/by-product")
    summaryByProduct() {

        return this.saleQuery.getTotalByProduct();
    }

    @Post("/:id/generate-journal")
    generateJournal(req) {

        this.saleService.generateJournal(req.params.id);
    }
}