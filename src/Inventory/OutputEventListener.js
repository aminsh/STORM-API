import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class OutputEventListener {

    @inject("EventBus")
    /**@type {EventBus}*/ eventBus = undefined;

    @inject("State")
    /**@type {IState}*/ state = undefined;

    @inject("InventoryRepository")
    /** @type{InventoryRepository}*/ inventoryRepository = undefined;

    @EventHandler("InventoryOutputCreated")
    onOutputCreated(output) {

        const stockId = output.stockId;

        output.inventoryLines.forEach(line =>
            this.eventBus.send("ProductInventoryChanged",
                line.productId,
                stockId,
                this.inventoryRepository.getInventoryByProduct(line.productId, this.state.fiscalPeriodId, stockId))
        );
    }

    @EventHandler("InventoryOutputChanged")
    onOutputChanged(oldOutput, newOutput) {

        if (oldOutput.stockId === newOutput.stockId) {
            const stockId = oldOutput.stockId;

            oldOutput.inventoryLines.asEnumerable().concat(newOutput.inventoryLines)
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, stockId)));
        }
        else {

            oldOutput.inventoryLines.asEnumerable()
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        oldOutput.stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, oldOutput.stockId)));

            newOutput.inventoryLines.asEnumerable()
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        newOutput.stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, newOutput.stockId)));
        }
    }

    @EventHandler("InventoryOutputRemoved")
    onOutputRemoved(input) {

        const stockId = input.stockId;

        input.inventoryLines.forEach(line =>
            this.eventBus.send("ProductInventoryChanged",
                line.productId,
                stockId,
                this.inventoryRepository.getInventoryByProduct(line.productId, this.state.fiscalPeriodId, stockId))
        );
    }
}