import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class InputController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @Get("/inputs")
    getAllInputs(req) {

        return this.inventoryQuery.getAll('input', req.query);
    }

    @Get("/inputs/max-number")
    getMaxInputNumber() {

        return this.inventoryQuery.getMaxNumber('input');
    }

    @Get("/inputs/without-invoice")
    getInputsWithoutInvoice(req) {

        return this.inventoryQuery.getAllWithoutInvoice('input', req.query);
    }

    @Get("/inputs/return-sale")
    getInputsReturnSale(req) {

        return this.inventoryQuery.getAllInputsWithIoType('inputBackFromSaleOrConsuming', req.query);
    }

    @Post("/inputs")
    createInput(req) {

        const id = this.inputService.create(req.body);

        return this.inventoryQuery.getById(id);
    }

    @Put("/inputs/:id")
    updateInput(req) {

        const id = req.params.id;

        this.inputService.update(id, req.body);

        return this.inventoryQuery.getById(id);
    }

    @Put("/inputs/:id/confirm")
    confirmOutput(req) {

        const id = req.params.id;

        this.inputService.confirm(id);

        return this.inventoryQuery.getById(id);
    }

    @Put("/inputs/:id/fix")
    fixOutput(req) {

        const id = req.params.id;

        this.inputService.fix(id);

        return this.inventoryQuery.getById(id);
    }

    @Delete("/inputs/:id")
    removeInput(req) {

        this.inputService.remove(req.params.id);
    }


}
