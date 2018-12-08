import {Controller, Get, Post} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class InventoryController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;

    @inject("InventoryService")
    /**@type{InventoryService}*/ inventoryService = undefined;

    @Get("/")
    getAll(req) {

        return this.inventoryQuery.getAll(null, req.query);
    }

    @Post("/transfer-between-stocks")
    transferBetweenStocks(req) {

        this.inventoryService.transferBetweenStocks(req.body);
    }

    @Get("/products")
    getAllInventoryProducts(req) {

        return this.inventoryQuery.getAllInventoryProducts(req.query);
    }

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

    @Post("/add-product-to-first-input/:productId")
    addProductToFirstInput(req) {

        this.inventoryService.addToInputFirst(req.params.productId, req.body);

    }


}
