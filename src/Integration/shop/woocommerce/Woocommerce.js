import {inject, injectable} from "inversify";
import WooCommerceAPI from "woocommerce-api";
import toResult from "asyncawait/await";
import {EventHandler} from "../../../Infrastructure/@decorators";

@injectable()
export class Woocommerce {

    @inject("BranchService")
    /**@type {BranchService}*/ branchService = undefined;

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("SaleService")
    /**@type{SaleService}*/ saleService = undefined;

    @inject("ProductRepository")
    /**@type{ProductRepository}*/ productRepository = undefined;

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    @inject("State") /**@type{IState}*/ state = undefined;

    getWooCommerceAPI(data) {
        return new WooCommerceAPI({
            url: data.url,
            consumerKey: data.consumerKey,
            consumerSecret: data.consumerSecret,
            wpAPI: true,
            version: 'wc/v1'
        });
    }

    register(data) {

        const WooCommerce = this.getWooCommerceAPI(data);

        let member = this.branchRepository.findMember(this.state.branchId, 'STORM-API-USER');

        if (!member)
            member = this.branchService.addUser(this.state.branchId, 'STORM-API-USER');

        toResult(
            WooCommerce.postAsync("webhooks", {
                name: 'Order created',
                topic: 'order.created',
                delivery_url: `${process.env['ORIGIN_URL']}/woocommerce/add-order?token=${member.token}`,
            })
        );

        toResult(
            WooCommerce.postAsync("webhooks", {
                name: 'Order updated',
                topic: 'order.updated',
                delivery_url: `${process.env['ORIGIN_URL']}/woocommerce/update-order?token=${member.token}`
            })
        );

        toResult(
            WooCommerce.postAsync("webhooks", {
                name: 'Order deleted',
                topic: 'order.deleted',
                delivery_url: `${process.env['ORIGIN_URL']}/woocommerce/delete-order?token=${member.token}`
            })
        );
    }

    addOrder(data) {

        if (data.hasOwnProperty('webhook_id'))
            return;

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            throw new ValidationException(['افزونه ووکامرسی وجود ندارد']);

        const WooCommerce = this.getWooCommerceAPI(wooCommerceThirdParty.data),

            customerId = data['customer_id'];

        const result = toResult(WooCommerce.getAsync(`customers/${customerId}`)),
            customer = JSON.parse(result.body);

        const sale = {
            orderId: data.id,
            title: 'شناسه سفارش : {0}'.format(order.id),
            customer: {
                referenceId: customerId,
                title: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                phone: customer.billing ? customer.billing.phone : null,
                address: customer.billing ? customer.billing.address_1 : null,
                province: customer.billing ? customer.billing.state : null,
                city: customer.billing ? customer.billing.city : null,
                postalCode: customer.billing ? customer.billing.postcode : null,
            },
            invoiceLines: data.line_items.map(item => ({
                product: {
                    referenceId: item.product_id,
                    title: item.name
                },
                quantity: parseFloat(item.quantity),
                unitPrice: parseFloat(item.price),
            }))
        };

        this.saleService.create(sale);
    }

    updateOrder(data) {

        if (data.hasOwnProperty('webhook_id'))
            return;

        const invoice = this.invoiceRepository.findByOrderId(data.id);

        if (!invoice)
            throw new ValidationException(['فاکتور به شماره سفارش ورودی وجود ندارد']);

        invoice.invoiceLines = data.line_items.map(item => ({
            product: {
                referenceId: item.product_id,
                title: item.name
            },
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.price),
        }));


        this.saleService.update(invoice);
    }

    deleteOrder(data) {

    }

    @EventHandler("ProductInventoryChanged")
    onProductInventoryChanged(productId, quantity) {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            return;

        const WooCommerce = this.getWooCommerceAPI(wooCommerceThirdParty.data),
            product = this.productRepository.findById(productId);

        toResult(
            WooCommerce.putAsync(`products/${product.referenceId}`, {
                manage_stock: true,
                stock_quantity: quantity
            })
        );
    }
}