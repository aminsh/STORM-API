import {Controller, Get, Post} from "../Infrastructure/expressUtlis";
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

    @Post("/")
    create(req) {

        const id = this.fiscalPeriodService.create(req.body);

        return this.fiscalPeriodQuery.getById(id);
    }
}