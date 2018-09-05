import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class InventoryController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;


    @Get("/:id")
    getById(req) {

        return this.inventoryQuery.getById(req.params.id);
    }

    @Get("/:id/lines")
    getDetailById(req) {

        return this.inventoryQuery.getDetailById(req.params.id, req.query);
    }

    @Get("/by-stock/:productId")
    getInventoriesByStock(req) {

        return this.inventoryQuery.getInventoriesByStock(req.params.productId);
    }

    @Get("/products")
    getAllInventoryProducts(req) {

        return this.inventoryQuery.getAllInventoryProducts(req.query);
    }
}
