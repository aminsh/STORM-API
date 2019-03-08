import { Controller, Delete, Get, Post, Put } from "../Infrastructure/expressUtlis";
import { inject } from "inversify";

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
        const cmd = req.body;

        const id = this.saleService.create(cmd);

        Utility.delay(500);

        if (cmd.status !== 'draft')
            this.saleService.confirm(id);

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

        const id = req.params.id,
            cmd = req.body,
            invoiceView = this.saleQuery.getById(id);

        this.saleService.update(id, req.body);

        if (cmd.status === 'draft' && invoiceView.status !== 'draft')
            this.saleService.confirm(id);

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

    @Delete('/:id/remove-journals')
    removeJournal(req) {
        this.saleService.removeJournal(req.params.id);
    }

    @Post("/:id/generate-outputs")
    generateOutputs(req) {
        const lines = req.body,
            id = req.params.id;

        if (lines && lines.length > 0)
            this.saleService.setStockToInvoice(id, lines);

        this.saleService.generateOutput(id);
    }

    @Delete('/:id/remove-outputs')
    removeOutputs(req) {
        this.saleService.removeOutputs(req.params.id);
    }
}