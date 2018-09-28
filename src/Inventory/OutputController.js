import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/inventories", "ShouldHaveBranch")
class OutputController {

    @inject("InventoryQuery")
    /**@type{InventoryQuery}*/ inventoryQuery = undefined;
    
    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

    @Get("/outputs")
    getAllOutputs(req) {

        return this.inventoryQuery.getAll('output', req.query);
    }

    @Get("/outputs/max-number")
    getMaxOutputNumber() {

        return this.inventoryQuery.getMaxNumber('output');
    }

    @Get("/outputs/without-invoice")
    getOutputsWithoutInvoice(req) {

        return this.inventoryQuery.getAllWithoutInvoice('output', req.query);
    }

    @Get("/outputs/return-purchase")
    getOutputsReturnSale(req) {

        return this.inventoryQuery.getAllInputsWithIoType('outputReturnPurchase', req.query);
    }

    @Post("/outputs")
    createOutput(req) {

        const id = this.outputService.create(req.body);

        return this.inventoryQuery.getById(id);
    }

    @Put("/outputs/:id")
    updateOutput(req) {

        const id = req.params.id;

        this.outputService.update(id, req.body);

        return this.inventoryQuery.getById(id);
    }

    @Delete("/outputs/:id")
    removeOutput(req) {

        this.outputService.remove(req.params.id);
    }
}
