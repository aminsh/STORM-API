import {inject, injectable} from "inversify";
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

    @inject("ReturnSaleService")
    /**@type{ReturnSaleService}*/ returnSaleService = undefined;

    @inject("ProductRepository")
    /**@type{ProductRepository}*/ productRepository = undefined;

    @inject("ProductService")
    /**@type{ProductService}*/ productService = undefined;

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    @inject("WoocommerceRepository")
    /**@type{WoocommerceRepository}*/ woocommerceRepository = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    @inject("State") /**@type{IState}*/ state = undefined;

    register(data) {

        let member = this.branchRepository.findMember(this.state.branchId, 'STORM-API-USER');

        if (!member)
            member = this.branchService.addUser(this.state.branchId, 'STORM-API-USER');

        this.woocommerceRepository.initWoocommerce(data);

        const baseUrl = `${process.env['ORIGIN_URL']}/v1/woocommerce`;

        try {

            this.woocommerceRepository.post('webhooks', {
                name: 'Order created',
                topic: 'order.created',
                delivery_url: `${baseUrl}/add-order?token=${member.token}`,
            });

            this.woocommerceRepository.post('webhooks', {
                name: 'Order updated',
                topic: 'order.updated',
                delivery_url: `${baseUrl}/update-order?token=${member.token}`
            });

            this.woocommerceRepository.post('webhooks', {
                name: 'Order deleted',
                topic: 'order.deleted',
                delivery_url: `${baseUrl}/delete-order?token=${member.token}`
            });
        }
        catch (e) {

            if(e.code === 'ENOTFOUND')
                throw new ValidationException(['آدرس معتبر نیست']);

            throw new ValidationSingleException(JSON.stringify(e));
        }
    }

    addOrder(data) {

        if (data.hasOwnProperty('webhook_id'))
            return;

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            throw new ValidationException(['افزونه ووکامرسی وجود ندارد']);

        const customerId = data['customer_id'];

        const customer = this.woocommerceRepository.get(`customers/${customerId}`);

        const sale = {
            orderId: data.id,
            title: 'شناسه سفارش : {0}'.format(data.id),
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

        invoice.customer = {id: invoice.detailAccountId};

        invoice.invoiceLines = data.line_items.map(item => ({
            product: {
                referenceId: item.product_id,
                title: item.name
            },
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.price),
        }));


        this.saleService.update(invoice.id, invoice);
    }

    deleteOrder(data) {

        if (data.hasOwnProperty('webhook_id'))
            return;

        const invoice = this.invoiceRepository.findByOrderId(data.id);

        if (!invoice)
            throw new ValidationException(['فاکتور به شماره سفارش ورودی وجود ندارد']);

        if(invoice.invoiceStatus === 'draft')
            return this.saleService.remove(invoice.id);

        let cmd = {
            ofInvoiceId: invoice.id,
            customer: {id: invoice.detailAccountId},
            title: 'بابت حذف سفارش شماره {0} '.format(data.id),
            discount: invoice.discount,
            invoiceLines: invoice.invoiceLines.map(line => ({
                product: {id: line.productId},
                stockId: line.stockId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
                vat: line.vat,
                tax: line.tax
            }))
        };

        this.returnSaleService.create(cmd);
    }

    syncProducts(){

        const products = this.woocommerceRepository.get('products');

        products.forEach(product =>
            this.productService.findByIdOrCreate({
                referenceId: product.id,
                title: product.name,
                salePrice: parseInt(product.price)
            }));
    }

    @EventHandler("ProductInventoryChanged")
    onProductInventoryChanged(productId) {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            return;

        const quantity = this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId),
            product = this.productRepository.findById(productId);

        this.woocommerceRepository.put(`products/${product.referenceId}`, {
            manage_stock: true,
            stock_quantity: quantity
        });
    }
}