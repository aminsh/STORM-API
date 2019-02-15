import { Controller, Get, Put, Post, Delete } from "../Infrastructure/expressUtlis";
import { inject } from "inversify";

@Controller("/v1/sale-types", "ShouldHaveBranch")
class SaleTypeController {

    @inject("InvoiceTypeService")
    /**@type{InvoiceTypeService}*/ invoiceTypeService = undefined;

    @inject("InvoiceTypeQuery")
    /**@type{InvoiceTypeQuery}*/ invoiceTypeQuery = undefined;

    @Get('/')
    getAll(req) {
        return this.invoiceTypeQuery.getAll('sale', req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.invoiceTypeQuery.getById(req.params.id);
    }

    @Post('/')
    create(req) {
        const id = this.invoiceTypeService.create('sale', req.body);
        return this.invoiceTypeQuery.getById(id);
    }

    @Put('/:id')
    update(req) {
        const id = req.params.id;
        this.invoiceTypeService.update(id, req.body);
        return this.invoiceTypeQuery.getById(id);
    }

    @Put('/:id/set-as-default')
    setAsDefault(req) {
        const id = req.params.id;
        this.invoiceTypeService.setAsDefault(id);
        return this.invoiceTypeQuery.getById(id);
    }

    @Delete('/:id')
    remove(req) {
        this.invoiceTypeService.remove(req.params.id);
    }
}