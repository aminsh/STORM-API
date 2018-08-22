import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class InputController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @Get("/inputs")
    @async()
    getAllInputs(req) {

        return this.inventoryQuery.getAll('input', req.query);
    }

    @Get("/inputs/max-number")
    @async()
    getMaxInputNumber() {

        return this.inventoryQuery.getMaxNumber('input');
    }

    @Get("/inputs/without-invoice")
    @async()
    getInputsWithoutInvoice(req) {

        return this.inventoryQuery.getAllWithoutInvoice('input', req.query);
    }

    @Get("/inputs/return-sale")
    @async()
    getInputsReturnSale(req) {

        return this.inventoryQuery.getAllInputsWithIoType('inputBackFromSaleOrConsuming', req.query);
    }

    @Post("/inputs")
    @async()
    createInput(req) {

        const id = this.inputService.create(req.body);

        return this.inventoryQuery.getById(id);
    }

    @Put("/inputs/:id")
    @async()
    updateInput(req) {

        const id = req.params.id;

        this.inputService.update(id, req.body);

        return this.inventoryQuery.getById(id);
    }

    @Delete("/inputs/:id")
    @async()
    removeInput(req) {

        this.inputService.remove(req.params.id);
    }


}
