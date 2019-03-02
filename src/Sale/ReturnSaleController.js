import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/return-sales", "ShouldHaveBranch")
class ReturnSaleController {

    @inject("ReturnSaleService")
    /** @type{ReturnSaleService}*/ returnSaleService = undefined;

    @inject("ReturnSaleQuery")
    /** @type{ReturnSaleQuery}*/ returnSaleQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.returnSaleQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.returnSaleQuery.getById(req.params.id);
    }

    @Get("/:id/compare-changes-invoice")
    compareChangesLines(req) {

        return this.returnSaleQuery.getCompareInvoiceOnChange(req.params.id, req.query.lines);
    }

    @Get("/max/number")
    maxNumber() {

        const result = this.returnSaleQuery.maxNumber();

        return result.max;
    }

    @Post("/")
    create(req) {

        const id = this.returnSaleService.create(req.body);

        if(req.body.status === 'confirm')
            this.returnSaleService.confirm(id);

        return this.returnSaleQuery.getById(id);
    }

    @Post("/:id/confirm")
    confirm(req) {

        const id = req.params.id;

        this.returnSaleService.confirm(id);

        return this.returnSaleQuery.getById(id);
    }

    @Post("/:id/fix")
    fix(req) {

        const id = req.params.id;

        this.returnSaleService.fix(id);

        return this.returnSaleQuery.getById(id);
    }

    @Put("/:id")
    update(req) {
        const id = req.params.id,
            before = this.returnSaleQuery.getById(id);

        if(!before)
            throw new NotFoundException();

        this.returnSaleService.update(id, req.body);

        if(req.body.status === 'confirm' && before.status === 'draft')
            this.returnSaleService.confirm(id);

        return this.returnSaleQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {
        this.returnSaleService.remove(req.params.id);
    }

    @Post("/:id/generate-journal")
    generateJournal(req) {
        this.returnSaleService.generateJournal(req.params.id);
    }
}