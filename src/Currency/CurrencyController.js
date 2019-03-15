import {inject} from "inversify";
import {Controller, Get, WithoutControlPermissions} from "../Infrastructure/expressUtlis";

@Controller("/v1/currency")
@WithoutControlPermissions()
class CurrencyController {

    @inject("CurrencyQuery")
    /** @type {CurrencyQuery} */ currencyQuery = undefined;


    @Get("/")
    getAll(req) {
        return this.currencyQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.currencyQuery.getById(req.params.id);
    }
}