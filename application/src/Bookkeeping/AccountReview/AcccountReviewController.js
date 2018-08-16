import {Controller, Get} from "../../core/expressUtlis";
import {async} from "../../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/account-review", "ShouldHaveBranch")
class AcccountReviewController {

    @inject("AccountReviewQuery")
    /**@type{AccountReviewQuery}*/ accountReviewQuery = undefined;

    @Get("/general-ledger-account")
    @async()
    generalLedgerAccount() {

        return this.accountReviewQuery.generalLedgerAccount();
    }

    @Get("/incomes-outcomes")
    @async()
    incomesAndOutcomes() {

        return this.accountReviewQuery.incomesAndOutcomes();
    }

    @Get("/subsidiary-ledger-account")
    @async()
    get() {
        return this.accountReviewQuery.subsidiaryLedgerAccount();
    }

    @Get("/detail-account")
    @async()
    detailAccount() {
        return this.accountReviewQuery.detailAccount();
    }

    @Get("/dimension-1")
    @async()
    dimension1() {
        return this.accountReviewQuery.dimension1();
    }

    @Get("/dimension-2")
    @async()
    dimension2() {
        return this.accountReviewQuery.dimension2();
    }

    @Get("/dimension-3")
    @async()
    dimension3() {
        return this.accountReviewQuery.dimension3();
    }

    @Get("/tiny")
    @async()
    tiny() {
        return this.accountReviewQuery.tiny();
    }
}