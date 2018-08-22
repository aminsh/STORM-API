import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class OutputController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;
    
    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

    @Get("/outputs")
    @async()
    getAllOutputs(req) {

        return this.inventoryQuery.getAll('output', req.query);
    }

    @Get("/outputs/max-number")
    @async()
    getMaxOutputNumber() {

        return this.inventoryQuery.getMaxNumber('output');
    }

    @Get("/outputs/without-invoice")
    @async()
    getOutputsWithoutInvoice(req) {

        return this.inventoryQuery.getAllWithoutInvoice('output', req.query);
    }

    @Get("/outputs/return-purchase")
    @async()
    getOutputsReturnSale(req) {

        return this.inventoryQuery.getAllInputsWithIoType('outputReturnPurchase', req.query);
    }

    @Post("/outputs")
    @async()
    createOutput(req) {

        const id = this.outputService.create(req.body);

        return this.inventoryQuery.getById(id);
    }

    @Put("/outputs/:id")
    @async()
    updateOutput(req) {

        const id = req.params.id;

        this.outputService.update(id, req.body);

        return this.inventoryQuery.getById(id);
    }

    @Delete("/outputs/:id")
    @async()
    removeOutput(req) {

        this.outputService.remove(req.params.id);
    }
}
