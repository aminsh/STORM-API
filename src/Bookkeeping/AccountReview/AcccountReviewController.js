import {Controller, Get} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/account-review", "ShouldHaveBranch")
class AccountReviewController {

    @inject("AccountReviewQuery")
    /**@type{AccountReviewQuery}*/ accountReviewQuery = undefined;

    @Get("/general-ledger-account")
    generalLedgerAccount() {

        return this.accountReviewQuery.generalLedgerAccount();
    }

    @Get("/incomes-outcomes")
    incomesAndOutcomes() {

        return this.accountReviewQuery.incomesAndOutcomes();
    }

    @Get("/subsidiary-ledger-account")
    get() {
        return this.accountReviewQuery.subsidiaryLedgerAccount();
    }

    @Get("/detail-account")
    detailAccount() {
        return this.accountReviewQuery.detailAccount();
    }

    @Get("/dimension-1")
    dimension1() {
        return this.accountReviewQuery.dimension1();
    }

    @Get("/dimension-2")
    dimension2() {
        return this.accountReviewQuery.dimension2();
    }

    @Get("/dimension-3")
    dimension3() {
        return this.accountReviewQuery.dimension3();
    }

    @Get("/tiny")
    tiny() {
        return this.accountReviewQuery.tiny();
    }
}