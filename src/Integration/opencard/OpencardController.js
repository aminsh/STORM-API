import {Controller, Post} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/open-card", "ShouldHaveBranch")
class OpencardController {

    @inject("SaleService")
    /** @type{SaleService}*/ saleService = undefined;

    /** @type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    @Post("/add-order-history")
    addOrderHistory(req) {
        const cmd = req.body,
            order = cmd.order,
            order_products = cmd.order_products,
            order_products_options = cmd.order_products_options,
            order_total = cmd.order_total,
            order_vouchers = cmd.order_vouchers,

            settings = this.settingsRepository.get();

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
                postalCode: order.shipping_postcode
            },
            invoiceLines: order_products.map(item => {

                const product_option_id = (order_products_options || [])
                        .filter(op => op.order_product_id === item.order_product_id),

                    product_referenceId = `${item.product_id}${product_option_id.length ? '-' : ''}${product_option_id.map(op => op.product_option_id).join('-')}`,

                    extra_title = [{key: 'مدل', value: item.model}, ...product_option_id.map(op => ({key: op.name, value: op.value}))]
                        .map(e => `${e.key}:${e.value}`)
                        .join(' ');

                return {
                    product: {
                        referenceId: product_referenceId,
                        title: `${item.name} ${extra_title}`
                    },
                    quantity: parseFloat(item.quantity),
                    unitPrice: parseFloat(item.price),
                }
            }),
            charges: cmd.order_total.asEnumerable()
                .join(settings.saleCharges,
                    order => order.code,
                    setting => setting.key,
                    (order, settings) => ({
                        key: settings.key,
                        value: Math.round(parseFloat(order.value))
                    })
                )
                .toObject(item => item.key, item => item.value)
        };

        this.saleService.create(sale);
    }
}
