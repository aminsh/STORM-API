import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/fiscal-periods", "ShouldHaveBranch")
class FiscalPeriodController {

    @inject("FiscalPeriodQuery")
    /**@type {FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    @inject("FiscalPeriodService")
    /**@type {FiscalPeriodService}*/ fiscalPeriodService = undefined;

    @Get("/")
    @async()
    getAll(req) {

        return this.fiscalPeriodQuery.getAll(req.query);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.fiscalPeriodService.create(req.body);

        return this.fiscalPeriodQuery.getById(id);
    }
}