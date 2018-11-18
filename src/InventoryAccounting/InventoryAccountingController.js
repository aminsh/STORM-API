import {Controller, Post, Put, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventory-accounting", "ShouldHaveBranch")
class InventoryAccountingController {

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @inject("InventoryAccountingQuery")
    /**@type{InventoryAccountingQuery}*/ inventoryAccountingQuery = undefined;

    @Post("/calculate")
    calculate() {

        this.inventoryAccountingPricingService.calculatePrice();
    }

    @Put("/inputs/:id/enter-price")
    inputEnterPrice(req) {
        this.inventoryAccountingPricingService.inputEnterPrice(req.params.id, req.body, true);
    }

    @Get("/tiny-turnover/by-product/:productId")
    getTinyTurnoverByProduct(req) {

        return this.inventoryAccountingQuery.getTinyTurnoverByProduct(req.params.productId, req.query);
    }

    @Get('/inventories')
    getAll(req) {

        return this.inventoryAccountingQuery.getAll(req.query);
    }

    @Get("/inventories/:id")
    getById(req) {

        return this.inventoryAccountingQuery.getById(req.params.id);
    }

    @Get("/:id/lines")
    getDetailById(req) {

        return this.inventoryAccountingQuery.getDetailById(req.params.id, req.query);
    }
}