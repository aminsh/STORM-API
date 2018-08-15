import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class InventoryController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;


    @Get("/:id")
    @async()
    getById(req) {

        return this.inventoryQuery.getById(req.params.id);
    }

    @Get("/:id/lines")
    @async()
    getDetailById(req) {

        return this.inventoryQuery.getDetailById(req.params.id, req.query);
    }

    @Get("/by-stock/:productId")
    @async()
    getInventoriesByStock(req) {

        return this.inventoryQuery.getInventoriesByStock(req.params.productId);
    }

    @Get("/products")
    @async()
    getAllInventoryProducts(req) {

        return this.inventoryQuery.getAllInventoryProducts(req.query);
    }
}
