import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/fiscal-periods", "ShouldHaveBranch")
class FiscalPeriodController {

    @inject("FiscalPeriodQuery")
    /**@type {FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    @inject("FiscalPeriodService")
    /**@type {FiscalPeriodService}*/ fiscalPeriodService = undefined;

    @Get("/")
    getAll(req) {

        return this.fiscalPeriodQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req){

        return this.fiscalPeriodQuery.getById(req.params.id);
    }

    @Post("/")
    create(req) {

        const id = this.fiscalPeriodService.create(req.body);

        return this.fiscalPeriodQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.fiscalPeriodService.update(id, req.body);

        return this.fiscalPeriodQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.fiscalPeriodService.remove(req.params.id);
    }
}