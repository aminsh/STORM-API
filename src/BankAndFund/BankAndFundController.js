import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/bank-and-fund", "ShouldHaveBranch")
export class BankAndFundController {

    @inject("BankAndFundQuery")
    /**@type {BankAndFundQuery}*/bankAndFundQuery = undefined;

    @Get("/")
    getAll(req) {

        return this.bankAndFundQuery.getAll(req.query);
    }

    @Get("/summary")
    getSummary() {

        return this.bankAndFundQuery.getSummary();

    }
}