import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";
import queryString from "query-string";

@Controller("/v1/payment-invoice", "ShouldHaveBranchForGuestUser")
class PaymentSaleController {

    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;

    @inject("Factory<PaymentGateway>") paymentGatewayFactory = undefined;

    @inject("State")
    /**@type{IState}*/ state = undefined;

    @inject("TreasuryPurposeService")
    /**@type{TreasuryPurposeService}*/ treasuryPurposeService = undefined;

    @inject('PaypingService')
    /**@type{PaypingService}*/ paypingService = undefined;

    @Get("/:id")
    redirectToGateway(req, res) {

        const id = req.params.id,
            paymentGateway = req.query.payment_gateway,
            originalReturnUrl = req.query.return_url || '/';

        if (paymentGateway === 'payping') {
            req.branchId = req.query.branchId;
            let result = this.paypingService.invoicePay(req.params.id, originalReturnUrl);

            return res.redirect(result.url);
        }

        const sale = this.saleQuery.getById(id),

            qs = {
                payment_gateway: paymentGateway,
                original_return_url: originalReturnUrl,
                branchId: this.state.branchId
            };

        const url = this.paymentGatewayFactory(paymentGateway).getPaymentUrl({
            returnUrl: `${process.env.ORIGIN_URL}/v1/payment-invoice/${id}/return/?${Object.keys(qs).map(key => `${key}=${qs[key]}`).join('&')}`,
            payerName: sale.customerDisplay,
            description: 'بابت فاکتور شماره {0}  به تاریخ {1}'.format(sale.number, sale.date),
            amount: sale.sumRemainder,
            referenceId: sale.id
        });

        res.redirect(url);
    }

    @Get("/:id/return", "SetValidUserForGuestUser")
    recordPayment(req, res) {

        const id = req.params.id,
            originalReturnUrl = req.query.original_return_url || '/',
            getReturnUrl = params => {
                let parse = queryString.parseUrl(originalReturnUrl),
                    qs = queryString.stringify(Object.assign({}, parse.query, params));

                return `${parse.url}?${qs}`;
            },
            paymentGateway = req.query.payment_gateway,
            sale = this.saleQuery.getById(id),

            result = this.paymentGatewayFactory(paymentGateway).verificate(Object.assign({}, req.query, {Amount: sale.sumRemainder / 10}));

        if (!result.success)
            return res.redirect(getReturnUrl({status: 'fail'}));

        const cmd = {
            reference: 'invoice',
            referenceId: sale.id,
            treasury: {
                treasuryType: 'receive',
                amount: result.amount,
                documentType: 'receipt',
                payerId: sale.customer.id,
                receiverId: result.accountId,
                transferDate: Utility.PersianDate.current(),
                documentDetail: {
                    date: Utility.PersianDate.current(),
                    number: result.referenceId
                }

            }
        };

        try {

            this.treasuryPurposeService.create(cmd);
            res.redirect(getReturnUrl({status: 'success'}));
        } catch (e) {
            console.log(e);
            res.redirect(getReturnUrl({status: 'paidButNotRecorded'}));
        }
    }
}