import {Controller, Post} from "../../Infrastructure/expressUtlis";
import {inject, postConstruct} from "inversify";

@Controller("/v1/open-card", "ShouldHaveBranch")
class OpencardController {

    @inject("SaleService")
    /** @type{SaleService}*/ saleService = undefined;

    @inject("InvoiceRepository")
    /** @type{InvoiceRepository}*/ invoiceRepository = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    settings = undefined;

    @postConstruct()
    init() {
        this.settings = this.settingsRepository.get();
    }

    @Post("/add-order-history")
    addOrderHistory(req) {
        const cmd = req.body,
            order = cmd.order,
            order_products = cmd.order_products,
            order_products_options = cmd.order_products_options,
            order_total = cmd.order_total,
            order_vouchers = cmd.order_vouchers;

        let sale = this.mapper(order,
            order_products,
            order_products_options,
            order_total,
            order_vouchers);

        const persistedSale = this.invoiceRepository.findByOrderId(order.order_id);

        if (persistedSale)
            this.saleService.update(persistedSale.id, sale);
        else
            this.saleService.create(sale);
    }

    mapper(order,
           order_products,
           order_products_options,
           order_total,
           order_vouchers) {

        const settings = this.settings;

        let sale = {
            orderId: order.order_id,
            title: 'شناسه سفارش : {0}'.format(order.order_id),
            customer: {
                referenceId: order.customer_id,
                title: `${order.firstname} ${order.lastname}`,
                email: order.email,
                phone: order.telephone,
                address: order.shipping_address_1,
                province: order.shipping_zone,
                city: order.shipping_city,
                postalCode: order.shipping_postcode,
                personType: 'real'
            },
            invoiceLines: order_products.map(item => {

                const product_option_id = (order_products_options || [])
                        .filter(op => op.order_product_id === item.order_product_id),

                    product_referenceId = `${item.product_id}${product_option_id.length ? '-' : ''}${product_option_id.map(op => op.product_option_id).join('-')}`,

                    extra_title = [{key: 'مدل', value: item.model}, ...product_option_id.map(op => ({
                        key: op.name,
                        value: op.value
                    }))]
                        .map(e => `${e.key}:${e.value}`)
                        .join(' ');

                return {
                    product: {
                        referenceId: product_referenceId,
                        title: `${item.name} ${extra_title}`
                    },
                    quantity: parseFloat(item.quantity),
                    unitPrice: this.toRial(order.currency_code, parseFloat(item.price)),
                }
            }),
            charges: order_total.asEnumerable()
                .join(settings.saleCharges,
                    ot => ot.code,
                    setting => setting.key,
                    (order, settings) => ({
                        key: settings.key,
                        value: this.toRial(order.currency_code, Math.round(parseFloat(ot.value)))
                    })
                )
                .toObject(item => item.key, item => item.value)
        };

        return sale;
    }

    toRial(currency_code, value) {
        if (!currency_code)
            return value;

        if (currency_code !== 'TOM')
            return value;

        return value * 10;
    }
}
