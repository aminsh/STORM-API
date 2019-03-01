import { injectable, inject } from "inversify";

@injectable()
export class OutputMapper {
    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    @inject('DetailAccountRepository')
    /**@type {DetailAccountRepository}*/ detailAccountRepository = undefined;

    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    @inject("InventoryRepository")
    /**@type{InventoryRepository}*/ inventoryRepository = undefined;


    map(id) {
        const output = this.inventoryRepository.findById(id),
            receiver = output.receiverId
                ? this.detailAccountRepository.findById(output.receiverId)
                : {},
            stock = output.stockId
                ? this.stockRepository.findById(output.stockId)
                : {};

        return {
            number: output.number,
            date: output.date,
            type: ( output.ioType ? this.inventoryIOTypeRepository.findById(output.ioType) : {} ).title,
            description: output.description,
            amount: output.inventoryLines.asEnumerable()
                .sum(item => item.quantity * item.unitPrice),
            receiver: receiver.id,
            receiverTitle: receiver.title,
            receiverCode: receiver.code,
            stock: stock.accountId,
            stockTitle: stock.title,
            products: output.inventoryLines.map(item => {
                const product = item.productId
                    ? this.productRepository.findById(item.productId)
                    : {};

                return {
                    id: product.accountId,
                    amount: item.quantity * item.unitPrice
                }
            })
        }
    }
}