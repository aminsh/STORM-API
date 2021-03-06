import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InputEventListener {

    @inject("EventBus")
    /**@type {EventBus}*/ eventBus = undefined;

    @inject("State")
    /**@type {IState}*/ state = undefined;

    @inject("InventoryRepository")
    /** @type{InventoryRepository}*/ inventoryRepository = undefined;

    @EventHandler("InventoryInputCreated")
    onInputCreated(id) {

        const input = this.inventoryRepository.findById(id),
            stockId = input.stockId;

        input.inventoryLines.forEach(line =>
            this.eventBus.send("ProductInventoryChanged",
                line.productId,
                stockId,
                this.inventoryRepository.getInventoryByProduct(line.productId, this.state.fiscalPeriodId, stockId))
        );
    }

    @EventHandler("InventoryInputChanged")
    onInputChanged(oldInput, id) {

        const newInput = this.inventoryRepository.findById(id);

        if (oldInput.stockId === newInput.stockId) {
            const stockId = oldInput.stockId;

            oldInput.inventoryLines.asEnumerable().concat(newInput.inventoryLines)
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, stockId)));
        }
        else {

            oldInput.inventoryLines.asEnumerable()
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        oldInput.stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, oldInput.stockId)));

            newInput.inventoryLines.asEnumerable()
                .select(line => line.productId)
                .distinct()
                .forEach(productId =>
                    this.eventBus.send("ProductInventoryChanged",
                        productId,
                        newInput.stockId,
                        this.inventoryRepository.getInventoryByProduct(productId, this.state.fiscalPeriodId, newInput.stockId)));
        }
    }

    @EventHandler("InventoryInputRemoved")
    onInputRemoved(input) {

        const stockId = input.stockId;

        input.inventoryLines.forEach(line =>
            this.eventBus.send("ProductInventoryChanged",
                line.productId,
                stockId,
                this.inventoryRepository.getInventoryByProduct(line.productId, this.state.fiscalPeriodId, stockId))
        );
    }
}