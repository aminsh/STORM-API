import {inject, injectable} from "inversify";

@injectable()
export class OutputTransferBetweenStocksMapper {
    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    @inject("OutputMapper")
    /**@type {OutputMapper}*/ outputMapper = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    map(id) {
        let output = this.inventoryRepository.findById(id),
            model = this.outputMapper.map(output),
            destinationStock = output.destinationStockId
                ? this.stockRepository.findById(output.destinationStockId)
                : {};

        model.destinationStock = destinationStock.accountId;

        return model;
    }
}