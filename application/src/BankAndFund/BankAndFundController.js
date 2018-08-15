import {Controller, Get} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/bank-and-fund", "ShouldHaveBranch")
export class BankAndFundController {

    @inject("BankAndFundQuery")
    /**@type {BankAndFundQuery}*/bankAndFundQuery = undefined;



    @Get("/")
    @async()
    getAll(req) {

        return this.bankAndFundQuery.getAll(req.query);
    }

    @Get("/summary")
    @async()
    getSummary() {

        return this.bankAndFundQuery.getSummary();

    }
}