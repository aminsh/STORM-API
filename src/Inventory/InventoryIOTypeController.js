import { Controller, Delete, Get, Post, Put } from "../Infrastructure/expressUtlis";
import { inject } from "inversify";

@Controller("/v1/inventory-io-types", "ShouldHaveBranch")
class InventoryIOTypeController {

    @inject("InventoryIOTypeService")
    /**@type{InventoryIOTypeService}*/ inventoryIOTypeService = undefined;

    @inject("InventoryIOTypeQuery")
    /**@type{InventoryIOTypeQuery}*/ inventoryIOTypeQuery = undefined;

    @Get("/")
    get(req) {

        return this.inventoryIOTypeQuery.getAll(null, req.query);
    }

    @Get("/:type")
    get(req) {

        return this.inventoryIOTypeQuery.getAll(req.params.type, req.query);
    }

    @Post("/:type")
    create(req) {

        let cmd = req.body;
        cmd.type = req.params.type;

        this.inventoryIOTypeService.create(cmd);
    }

    @Put("/:id")
    update(req) {

        this.inventoryIOTypeService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.inventoryIOTypeService.remove(req.params.id);
    }
}