import { inject, injectable } from "inversify";

@injectable()
export class InputMapper {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    @inject('DetailAccountRepository')
    /**@type {DetailAccountRepository}*/ detailAccountRepository = undefined;

    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;

    map(id) {
        const input = this.inventoryRepository.findById(id),

            deliverer = input.delivererId
                ? this.detailAccountRepository.findById(input.delivererId)
                : {},
            stock = input.stockId
                ? this.stockRepository.findById(input.stockId)
                : {};

        return {
            number: input.number,
            date: input.date,
            description: input.description,
            amount: input.inventoryLines.asEnumerable()
                .sum(item => item.quantity * item.unitPrice),
            deliverer: deliverer.id,
            delivererTitle: deliverer.title,
            delivererCode: deliverer.code,
            stock: stock.accountId,
            stockTitle: stock.title,
            products: input.inventoryLines.map(item => {
                const product = item.productId
                    ? this.productRepository.findById(item.productId)
                    : {};

                return {
                    id: product.accountId,
                    amount: item.quantity * item.unitPrice
                }
            })
        };
    }
}