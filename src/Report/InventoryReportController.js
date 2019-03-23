import { Controller, Get, } from "../Infrastructure/expressUtlis";
import { inject } from "inversify";

@Controller("/v1/reports", "ShouldHaveBranch")
export class InventoryReportController {
    @inject("InventoryReportQuery")
    /**@type{InventoryReportQuery}*/ inventoryReportQuery = undefined;

    @Get("/inventory-turnover")
    getInventoriesTurnover(req) {
        return this.inventoryReportQuery.getInventoriesTurnover(req.query);
    }

    @Get("/product-turnover")
    getProductTurnovers(req) {
        return this.inventoryReportQuery.getProductTurnovers(req.query);
    }

    @Get("/product-turnover-total")
    getProductTurnoversTotal(req) {
        return this.inventoryReportQuery.productInventoryTotal(req.query);
    }

    @Get('/tiny-inventory-turnover-by-product')
    getTinyInventoryTurnoverByProduct(req) {
        return this.inventoryReportQuery.getTinyTurnoverByProduct(req.query);
    }
}