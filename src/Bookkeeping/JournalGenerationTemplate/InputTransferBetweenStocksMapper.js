import {inject, injectable} from "inversify";

@injectable()
export class InputTransferBetweenStocksMapper {
    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    @inject("InputMapper")
    /**@type {InputMapper}*/ inputMapper = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    map(id) {
        const input = this.inventoryRepository.findById(id);

        let model = this.inputMapper.map(id),
            sourceStock = input.sourceStockId
                ? this.stockRepository.findById(input.sourceStockId)
                : {};

        model.sourceStock = sourceStock.accountId;

        return model;
    }
}