import {inject, injectable} from "inversify";
import {EventHandler} from "../../../Infrastructure/@decorators";

@injectable()
export class Woocommerce {

    @inject("BranchService")
    /**@type {BranchService}*/ branchService = undefined;

    @inject("BranchRepository")
    /** @type {BranchRepository}*/ branchRepository = undefined;

    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;

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

    @inject("TreasuryPurposeService")
    /**@type{TreasuryPurposeService}*/ treasuryPurposeService = undefined;

    @inject("State") /**@type{IState}*/ state = undefined;

    @inject('LoggerService') /**@type{LoggerService}*/loggerService;

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

            if (e.code === 'ENOTFOUND')
                throw new ValidationException(['آدرس معتبر نیست']);

            throw new ValidationSingleException(JSON.stringify(e));
        }
    }

    updateSettings(data) {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        wooCommerceThirdParty.data.consumerKey = data.consumerKey;
        wooCommerceThirdParty.data.consumerSecret = data.consumerSecret;
        wooCommerceThirdParty.data.url = data.url;

        this.registeredThirdPartyRepository.update('woocommerce', wooCommerceThirdParty.data);
    }

    addOrder(data) {

        if (!data)
            return;

        if (typeof data.webhook_id !== 'undefined')
            return;

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            throw new ValidationException(['افزونه ووکامرسی وجود ندارد']);

        const customerId = data['customer_id'];

        let customer = null;

        try {
            customer = this.woocommerceRepository.get(`customers/${customerId}`);
        }
        catch (e) {
            customer = {customerId: '0', first_name: 'مشتری وجود ندارد', last_name: ''};
        }

        const sale = {
            orderId: data.id,
            title: 'شناسه سفارش : {0}'.format(data.id),
            customer: {
                referenceId: customer.customerId,
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
                unitPrice: Woocommerce.toRial(data.currency, parseFloat(item.price)),
            }))
        };

        const id = this.saleService.create(sale);

        Utility.delay(500);

        try {
            this.saleService.confirm(id);
        }
        catch (e) {
            this.loggerService.invalid(e, 'woocommerce.confirm.invoice');
        }

        const invoice = this.saleQuery.getById(id);

        this.recordPayment(data, invoice);
    }

    updateOrder(data) {

        if (!data)
            return;

        if (typeof data.webhook_id !== 'undefined')
            return;

        const invoice = this.saleQuery.getByOrderId(data.id);

        if (!invoice)
            throw new ValidationException(['فاکتور به شماره سفارش ورودی وجود ندارد']);

        invoice.invoiceLines = data.line_items.map(item => ({
            product: {
                referenceId: item.product_id,
                title: item.name
            },
            quantity: parseFloat(item.quantity),
            unitPrice: Woocommerce.toRial(data.currency, parseFloat(item.price)),
        }));


        this.saleService.update(invoice.id, invoice);

        Utility.delay(500);

        try {
            if(invoice.status === 'draft')
                this.saleService.confirm(invoice.id);
        }
        catch (e) {
            this.loggerService.invalid(e, 'woocommerce.confirm.invoice');
        }

        this.recordPayment(data, this.saleQuery.getById(invoice.id));
    }

    recordPayment(data, invoice) {

        if (!data.transaction_id)
            return;

        if (invoice.sumRemainder === 0)
            return;

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        const paymentMethod = (wooCommerceThirdParty.data.paymentMethod && wooCommerceThirdParty.data.paymentMethod.length > 0
            ? wooCommerceThirdParty.data.paymentMethod.asEnumerable().singleOrDefault(item => item.key === data.payment_method)
            : null || {}),
            accountId = paymentMethod.accountId;

        if (!accountId)
            return;

        paymentMethod.accountType = paymentMethod.accountType || 'bank';

        let cmd;

        if (paymentMethod.accountType === 'fund')
            cmd = {
                reference: 'invoice',
                referenceId: invoice.id,
                treasury: {
                    treasuryType: 'receive',
                    amount: invoice.sumTotalPrice,
                    documentType: 'cash',
                    payerId: invoice.customer.id,
                    receiverId: accountId,
                    transferDate: Utility.PersianDate.current(),
                    documentDetail: {}

                }
            };

        if (paymentMethod.accountType === 'bank')
            cmd = {
                reference: 'invoice',
                referenceId: invoice.id,
                treasury: {
                    treasuryType: 'receive',
                    amount: invoice.sumTotalPrice,
                    documentType: 'receipt',
                    payerId: invoice.customer.id,
                    receiverId: accountId,
                    transferDate: Utility.PersianDate.current(),
                    documentDetail: {
                        date: Utility.PersianDate.current(),
                        number: data.transaction_id
                    }

                }
            };

        this.treasuryPurposeService.create(cmd);
    }

    deleteOrder(data) {

        if (!data)
            return;

        if (typeof data.webhook_id !== 'undefined')
            return;

        const invoice = this.saleQuery.getByOrderId(data.id);

        if (!invoice)
            throw new ValidationException(['فاکتور به شماره سفارش ورودی وجود ندارد']);

        if (invoice.invoiceStatus === 'draft')
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

    syncProducts() {

        const products = this.woocommerceRepository.get('products');

        products.forEach(product =>
            this.productService.findByIdOrCreate({
                referenceId: product.id,
                title: product.name,
                salePrice: parseInt(product.price)
            }));
    }

    /**
     * @param {AssignPaymentGatewaysToAccount[]} command*/
    assignPaymentGatewaysToAccount(command) {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        const paymentMethod = command
            .filter(item => item.key && item.accountId)
            .map(item => ({key: item.key, accountId: item.accountId, accountType: item.accountType}));

        let data = wooCommerceThirdParty.data;

        data.paymentMethod = paymentMethod;

        this.registeredThirdPartyRepository.update(wooCommerceThirdParty.key, data);

    }

    @EventHandler("ProductInventoryChanged")
    onProductInventoryChanged(productId) {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        if (!wooCommerceThirdParty)
            return;

        /**@type{WoocommerceData}*/
        const data = wooCommerceThirdParty.data;

        const quantity = this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId),
            product = this.productRepository.findById(productId);

        if(data.canChangeStock) {
            this.woocommerceRepository.put(`products/${product.referenceId}`, {
                manage_stock: true,
                stock_quantity: quantity
            });
        }

        if(data.canChangeStockStatusOnZeroQuantity && quantity <= 0) {
            this.woocommerceRepository.put(`products/${product.referenceId}`, {
                stock_status: 'outofstock'
            });
        }
    }

    static toRial(currency, value) {
        if (currency === 'IRT')
            return value * 10;
        if (currency === 'IRR')
            return value;
    }
}