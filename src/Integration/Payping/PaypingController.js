import {Controller, Get, Post} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/payping")
class PaypingController {
    @inject("PaypingService")
    /**@type{PaypingService}*/ paypingService = undefined;

    @Post("/invoice/sync", "ShouldHaveBranch")
    syncInvoices() {
        this.paypingService.sync();
    }
}