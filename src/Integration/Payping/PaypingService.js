import {inject, injectable} from "inversify";
import qs from "qs";
import queryString from "query-string";

const paypingBaseUrl = 'https://api.payping.ir';

@injectable()
export class PaypingService {
    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;
    @inject("HttpRequest")
    /**@type{HttpRequest}*/ httpRequest = undefined;
    @inject('LoggerService')
    /**@type{LoggerService}*/ loggerService = undefined;
    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;
    @inject("SaleService")
    /**@type{SaleService}*/ saleService = undefined;
    @inject('State') state = undefined;
    @inject("TreasuryPurposeService")
    /**@type{TreasuryPurposeService}*/ treasuryPurposeService = undefined;

    updateSettings(data) {
        const paypingThirdParty = this.registeredThirdPartyRepository.get("payping");
        paypingThirdParty.data.accountId = data.accountId;
        this.registeredThirdPartyRepository.update('payping', paypingThirdParty.data);
    }

    invoicesSync() {
        const paypingThirdParty = this.registeredThirdPartyRepository.get('payping');

        const invoices = this.httpRequest.get(`${paypingBaseUrl}/v1/invoice/List`)
            .query({isArchived: false})
            .setHeader('Authorization', paypingThirdParty.data.token)
            .execute();

        invoices.forEach(invoice => {
            const stormInvoice = this.saleQuery.getByOrderId(invoice.code);
            if (stormInvoice)
                return;

            this.createInvoice(invoice.code);
        });
    }

    invoicePay(invoiceId, returnUrl) {
        const paypingThirdParty = this.registeredThirdPartyRepository.get('payping'),
            invoice = this.saleQuery.getById(invoiceId),
            queryString = {
                branchId: this.state.branchId,
                returnUrl
            };
        let cmd = {
            payerName: invoice.customerDisplay,
            amount: invoice.sumRemainder / 10,
            returnUrl: `${process.env['ORIGIN_URL']}/v1/payping/invoice/payment/callback/${invoiceId}?${qs.stringify(queryString)}`,
            description: 'بابت فاکتور شماره {0}  به تاریخ {1}'.format(invoice.number, invoice.date),
        };

        let result;

        try {
            result = this.httpRequest.post(`${paypingBaseUrl}/v1/pay`)
                .query({isArchived: false})
                .setHeader('Authorization', paypingThirdParty.data.token)
                .body(cmd)
                .execute();

            this.loggerService.success({invoiceId, cmd, result}, 'PaypingService.invoicePay');
        }
        catch (e) {
            this.loggerService.invalid(e, 'PaypingService.pay')
        }

        return {url: `${paypingBaseUrl}/v1/pay/gotoipg/${result.code}`};
    }

    confirmInvoicePay(invoiceId, refid, returnUrl) {
        const paypingThirdParty = this.registeredThirdPartyRepository.get('payping');
        console.log('get paypingThirdParty');
        const invoice = this.saleQuery.getById(invoiceId);
        console.log('get invoice');

        try {
            console.log('start request verify to payping');
            let result = this.httpRequest.post(`${paypingBaseUrl}/v1/pay/verify`)
                .query({isArchived: false})
                .setHeader('Authorization', paypingThirdParty.data.token)
                .body({refid, amount: invoice.sumRemainder / 10})
                .execute();

            console.log('end request verify to payping');
            console.log(JSON.stringify(result));
        }
        catch (e) {
            console.log('error request verify to payping');
            console.log(JSON.stringify(e));
            this.loggerService.invalid(e, 'PaypingService.verify.payment');

            throw new Error(e);
        }

            /*if (!paypingThirdParty.data.accountId)
                return;

            const cmd = {
                reference: 'invoice',
                referenceId: invoice.id,
                treasury: {
                    treasuryType: 'receive',
                    amount: invoice.sumRemainder,
                    description: 'بابت پرداخت از پی پینگ - شماره پیگیری : {0}'.format(refid),
                    documentType: 'cash',
                    payerId: invoice.customer.id,
                    receiverId: paypingThirdParty.data.accountId,
                    transferDate: Utility.PersianDate.current(),
                    documentDetail: {
                        date: Utility.PersianDate.current(),
                        number: refid
                    }
                }
            };*/

            const getReturnUrl = params => {
                let parse = queryString.parseUrl(returnUrl),
                    qs = queryString.stringify(Object.assign({}, parse.query, params));

                return `${parse.url}?${qs}`;
            };

            try {
                console.log('start redirect to dashboard');
                const url = getReturnUrl({status: 'success'});
                console.log(url);
                //this.treasuryPurposeService.create(cmd);
                return getReturnUrl({status: 'success'});
            } catch (e) {
                console.log('error redirect to dashboard');
                console.log(JSON.stringify(e));
                console.log(e);
                return getReturnUrl({status: 'paidButNotRecorded'});
            }
        }

        createInvoice(code)
        {
            const paypingThirdParty = this.registeredThirdPartyRepository.get('payping'),
                paypingInvoice = this.httpRequest.get(`${paypingBaseUrl}/v1/invoice/${code}`)
                    .setHeader('Authorization', paypingThirdParty.data.token)
                    .execute();

            const customer = paypingInvoice.billToes[0].addressBook;

            const sale = {
                orderId: code,
                title: 'شناسه سفارش : {0} - پی پینگ'.format(code),
                customer: {
                    referenceId: customer.code,
                    title: customer.fullName,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.location,
                    province: customer.state,
                    city: customer.city,
                    postalCode: customer.zipCode,
                },
                invoiceLines: paypingInvoice.invoiceItems.map(item => ({
                    product: {
                        referenceId: item.code,
                        title: item.name
                    },
                    quantity: parseFloat(item.quantity),
                    unitPrice: this.toRial(parseFloat(item.price)),
                }))
            };

            this.saleService.create(sale);
        }

        toRial(value)
        {

            return value * 10;
        }
    }