import { injectable, inject } from "inversify";

@injectable()
export class MapperFactory {
    @inject("SaleMapper") saleMapper = undefined;
    @inject("PurchaseMapper") purchaseMapper = undefined;
    @inject("InputMapper") inputMapper = undefined;
    @inject("InputPurchaseMapper") inputPurchaseMapper = undefined;
    @inject("InputTransferBetweenStocksMapper") inputTransferBetweenStocksMapper = undefined;
    @inject("OutputMapper") outputMapper = undefined;
    @inject("OutputTransferBetweenStocksMapper") outputTransferBetweenStocksMapper = undefined;

    get(model) {
        const mapper = {
            Sale: this.saleMapper,
            Purchase: this.purchaseMapper,
            Input: this.inputMapper,
            InputPurchase: this.inputPurchaseMapper,
            InputTransferBetweenStocks: this.inputTransferBetweenStocksMapper,
            Output: this.outputMapper,
            OutputTransferBetweenStocks: this.outputTransferBetweenStocksMapper
        };

        return mapper[ model ];
    }
}