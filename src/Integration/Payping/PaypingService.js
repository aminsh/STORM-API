import {inject, injectable, postConstruct} from "inversify";

const paypingBaseUrl = 'https://api.payping.ir';

@injectable()
export class PaypingService {
    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;
    @inject("HttpRequest")
    /**@type{HttpRequest}*/ httpRequest = undefined;
    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;
    @inject("SaleService")
    /**@type{SaleService}*/ saleService = undefined;

    sync() {
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

    createInvoice(code) {
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

    toRial(value) {

        return value * 10;
    }
}