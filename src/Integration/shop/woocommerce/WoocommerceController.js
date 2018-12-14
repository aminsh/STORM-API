import {Controller, Post, Get, Put} from "../../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/woocommerce", "ShouldHaveBranch")
class WoocommerceController {

    @inject("Woocommerce")
    /**@type{Woocommerce}*/ woocommerce = undefined;

    @inject("WoocommerceRepository")
    /**@type{WoocommerceRepository}*/ WoocommerceRepository = undefined;

    @inject("RegisteredThirdPartyRepository")
    /**@type{RegisteredThirdPartyRepository}*/ registeredThirdPartyRepository = undefined;

    @Post('/add-order')
    addOrder(req) {

        this.woocommerce.addOrder(req.body);
    }

    @Post('/update-order')
    updateOrder(req) {

        this.woocommerce.updateOrder(req.body);
    }

    @Post("/delete-order")
    deleteOrder(req) {

        this.woocommerce.deleteOrder(req.body);
    }

    @Get("/products")
    getProductById() {

        try {
            return this.WoocommerceRepository.get('products');

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
            .map(item => ({
                key: item.id,
                display: item.title,
                accountId: (persistedPaymentMethod.asEnumerable().singleOrDefault(p => p.key === item.id) || {}).accountId,
                accountType: (persistedPaymentMethod.asEnumerable().singleOrDefault(p => p.key === item.id) || {}).accountType,
            }));
    }

    @Post("/payment-gateways/assign-to-account")
    assignPaymentGatewaysToAccount(req) {

        this.woocommerce.assignPaymentGatewaysToAccount(req.body);
    }

}