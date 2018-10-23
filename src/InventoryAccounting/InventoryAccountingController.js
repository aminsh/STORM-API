import {Controller, Post, Put, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventory-accounting", "ShouldHaveBranch")
class InventoryAccountingController {

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @inject("InventoryAccountingQuery")
    /**@type{InventoryAccountingQuery}*/ inventoryAccountingQuery = undefined;

    @Post("/calculate")
    calculate(req) {

        this.inventoryAccountingPricingService.calculate(req.body);
    }

    @Put("/inputs/:id/enter-price")
    inputEnterPirce(req) {
        this.inventoryAccountingPricingService.inputEnterPrice(req.params.id, req.body);
    }

    @Get("/tiny-turnover/by-product/:productId")
    getTityTurnoverByProduct(req){

        return this.inventoryAccountingQuery.getTinyTurnoverByProduct(req.params.productId, req.query);
    }
}