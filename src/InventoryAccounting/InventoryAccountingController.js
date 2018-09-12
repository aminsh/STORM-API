import {Controller, Post} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventory-accounting", "ShouldHaveBranch")
class InventoryAccountingController {

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @Post("/calculate")
    calculate(req) {

        this.inventoryAccountingPricingService.calculate(req.body);
    }
}