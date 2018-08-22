import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/inventory-io-types", "ShouldHaveBranch")
class InventoryIOTypeController {

    @inject("InventoryIOTypeService")
    /**@type{InventoryIOTypeService}*/ inventoryIOTypeService = undefined;

    @inject("InventoryIOTypeQuery")
    /**@type{InventoryIOTypeQuery}*/ inventoryIOTypeQuery = undefined;

    @Get("/:type")
    @async()
    get(req) {

        return this.inventoryIOTypeQuery.getAll(req.params.type, req.query);
    }

    @Post("/:type")
    @async()
    create(req) {

        let cmd = req.body;
        cmd.type = req.params.type;

        this.inventoryIOTypeService.create(cmd);
    }

    @Put("/:id")
    @async()
    update(req) {

        this.inventoryIOTypeService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.inventoryIOTypeService.remove(req.params.id);
    }
}