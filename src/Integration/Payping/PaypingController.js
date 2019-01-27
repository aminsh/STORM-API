import {Controller, Post, Get, Put, WithoutControlPermissions} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/payping")
class PaypingController {
    @inject("PaypingService")
    /**@type{PaypingService}*/ paypingService = undefined;

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    @Post("/invoice/sync", "ShouldHaveBranch")
    syncInvoices() {
        this.paypingService.invoicesSync();
    }

    @Post('/invoice/:invoiceId', 'ShouldHaveBranchForGuestUser')
    payInvoice(req) {
        return this.paypingService.invoicePay(req.params.invoiceId, req.query.returnUrl);
    }

    @Get('/invoice/payment/callback/:invoiceId',
        'SetValidUserForGuestUser',
        'ShouldHaveBranchForGuestUser')
    invoicePaymentCallback(req, res) {
        let url = this.paypingService.confirmInvoicePay(req.params.invoiceId, req.query.refid, req.query.returnUrl);
        res.redirect(url);
    }

    @Get("/settings", "ShouldHaveBranch")
    getSettings() {
        const paypingThirdParty = this.registeredThirdPartyRepository.get("payping");
        return paypingThirdParty.data;
    }

    @Put("/settings", "ShouldHaveBranch")
    @WithoutControlPermissions()
    saveSettings(req) {
        this.paypingService.updateSettings(req.body);
    }
}