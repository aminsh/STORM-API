import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/send-invoice", "ShouldHaveBranchForGuestUser")
class SendSaleController {

    @inject("BranchQuery")
    /**@type{BranchQuery}*/ branchQuery = undefined;

    @inject("ThirdPartyQuery")
    /**@type{ThirdPartyQuery}*/ thirdPartyQuery = undefined;

    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;

    @inject("ReportInvoiceQuery")
    /**@type{ReportInvoiceQuery}*/ reportInvoiceQuery = undefined;

    @inject("TreasuryPurposesQuery")
    /**@type{TreasuryPurposeQuery}*/ treasuryPurposeQuery = undefined;

    @inject("Enums") enums = undefined;

    @inject("State")
    /**@type{IState}*/ state = undefined;

    @Get("/:id")
    get(req) {

        const id = req.params.id;

        const branch = this.branchQuery.find({id: this.state.branchId}, true);

        const thirdPartyPaymentGateways = this.thirdPartyQuery.get(
            this.enums.ThirdParty().data.filter(item => item.type === 'paymentGateway').map(item => item.key)),

            paymentGateways = this.enums.ThirdParty().data.filter(item => thirdPartyPaymentGateways.map(t => t.key).includes(item.key)),

            invoice = this.saleQuery.getById(id);

        if (!invoice)
            throw new NotFoundException();

        const invoicePrint = this.reportInvoiceQuery.invoice(id),

            receives = this.treasuryPurposeQuery.getByInvoiceId(id);

        return {invoice, invoicePrint, receives: receives.data, branch, paymentGateways};
    }
}