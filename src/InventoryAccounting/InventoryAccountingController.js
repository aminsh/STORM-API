import {Controller, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventory-accounting", "ShouldHaveBranch")
class InventoryAccountingController {

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @Post("/calculate")
    calculate(req) {

        this.inventoryAccountingPricingService.calculate(req.body);
    }

    @Put("/inputs/:id/enter-price")
    inputEnterPirce(req) {
        this.inventoryAccountingPricingService.inputEnterPrice(req.params.id, req.body);
    }
}