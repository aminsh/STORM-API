import { inject } from "inversify";
import { Controller, Post, Delete, Get } from "../Infrastructure/expressUtlis";
import { InventoryPricingQuery } from "./InventoryPricingQuery";

@Controller('/v1/inventory-pricing', "ShouldHaveBranch")
class InventoryPricingController {
    @inject("InventoryPricingService")
    /**@type{InventoryPricingService}*/ inventoryPricingService = undefined;

    @inject("InventoryPricingQuery")
    /**@type{InventoryPricingQuery}*/ inventoryPricingQuery = undefined;

    @Get('/')
    getAll(req) {
        return this.inventoryPricingQuery.getAll(req.query);
    }

    @Get('/:id')
    getById(req) {
        return this.inventoryPricingQuery.getById(req.params.id);
    }

    @Get('/:id/products')
    getAllProducts(req) {
        return this.inventoryPricingQuery.getProducts(req.params.id, req.query);
    }

    @Get('/:id/inventories')
    getAllInventories(req) {
        return this.inventoryPricingQuery.getInventories(req.params.id, req.query);
    }

    @Post("/calculate")
    calculate(req) {
        this.inventoryPricingService.calculate(req.body);
    }

    @Delete("/:id")
    remove(req) {

    }
}