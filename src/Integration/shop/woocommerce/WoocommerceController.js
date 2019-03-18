import { Controller, Post, Get, Put } from "../../../Infrastructure/expressUtlis";
import { inject } from "inversify";
import queryString from "query-string";

@Controller("/v1/woocommerce", "ShouldHaveBranch")
class WoocommerceController {

    @inject("Woocommerce")
    /**@type{Woocommerce}*/ woocommerce = undefined;

    @inject("WoocommerceRepository")
    /**@type{WoocommerceRepository}*/ WoocommerceRepository = undefined;

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    @inject("SaleQuery")
    /**@type{SaleQuery}*/ saleQuery = undefined;

    @inject("ProductQuery")
    /**@type{ProductQuery}*/ productQuery = undefined;

    @Post('/add-order')
    addOrder(req) {
        this.woocommerce.addOrUpdateOrder(req.body);
    }

    @Post('/update-order')
    updateOrder(req) {
        this.woocommerce.addOrUpdateOrder(req.body);
    }

    @Post("/delete-order")
    deleteOrder(req) {
        this.woocommerce.deleteOrder(req.body);
    }

    @Get("/products")
    getProductByPage(req) {
        const params = {
            per_page: req.query.take,
            offset: req.query.skip
        };

        try {
            const productsResult = this.WoocommerceRepository.get(`products?${queryString.stringify(params)}`, true);
            const products = this.productQuery.getManyByReferenceId(productsResult.data.map(item => item.id));

            products.forEach(item => item.referenceId = parseInt(item.referenceId));

            const result = productsResult.data.asEnumerable()
                .groupJoin(
                    products,
                    item => item.id,
                    product => product.referenceId,
                    (item, products) => Object.assign({}, item, { registered: products.any() })
                )
                .toArray();

            return { data: result, total: productsResult.total };
        }
        catch (e) {

            if (e.data.status === 404)
                throw new NotFoundException();

            if (e.data.status === 401)
                throw new ForbiddenException(e.message);

            if (e.data.status === 400)
                throw new ValidationSingleException(e.message);
        }
    }

    @Get("/orders")
    getOrdersByPage(req) {
        const params = {
            per_page: req.query.take,
            offset: req.query.skip
        };

        if (req.query.filter && Array.isArray(req.query.filter.filters)) {
            req.query.filter.filters.forEach(f => params[ f.field ] = f.value);
        }

        try {
            const ordersResult = this.WoocommerceRepository.get(`orders?${queryString.stringify(params)}`, true);
            const invoices = this.saleQuery.getByOrderIds(ordersResult.data.map(item => item.id));

            invoices.forEach(item => item.orderId = parseInt(item.orderId));

            const result = ordersResult.data.asEnumerable()
                .groupJoin(
                    invoices,
                    order => order.id,
                    invoice => invoice.orderId,
                    (order, items) => Object.assign({}, order, { invoice: items.firstOrDefault() })
                )
                .toArray();
            return { data: result, total: ordersResult.total };
        }
        catch (e) {

            if (e.data.status === 404)
                throw new NotFoundException();

            if (e.data.status === 401)
                throw new ForbiddenException(e.message);

            if (e.data.status === 400)
                throw new ValidationSingleException(e.message);
        }
    }

    @Post('/products/sync')
    syncProducts() {
        this.woocommerce.syncProducts();
    }

    @Post('/products/sync-one')
    syncOneProduct(req) {
        this.woocommerce.syncOneProduct(req.body);
    }

    @Get("/settings")
    getSettings() {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        return wooCommerceThirdParty.data;
    }

    @Put("/settings")
    saveSettings(req) {

        this.woocommerce.updateSettings(req.body);

    }

    @Get("/payment-gateways")
    getPaymentGateways() {

        const wooCommerceThirdParty = this.registeredThirdPartyRepository.get("woocommerce");

        const persistedPaymentMethod = wooCommerceThirdParty.data.paymentMethod || [];

        const allPaymentGateways = this.WoocommerceRepository.get('payment_gateways');

        return allPaymentGateways
            .filter(item => item.enabled)
            .map(item => ( {
                key: item.id,
                display: item.title,
                accountId: ( persistedPaymentMethod.asEnumerable().singleOrDefault(p => p.key === item.id) || {} ).accountId,
                accountType: ( persistedPaymentMethod.asEnumerable().singleOrDefault(p => p.key === item.id) || {} ).accountType,
            } ));
    }

    @Post("/payment-gateways/assign-to-account")
    assignPaymentGatewaysToAccount(req) {

        this.woocommerce.assignPaymentGatewaysToAccount(req.body);
    }

}