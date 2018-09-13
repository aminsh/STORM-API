import {inject, injectable} from "inversify";

@injectable()
export class ProductInventoryService {

    @inject("ProductInventoryTransactionalRepository")
    /** @type {ProductInventoryTransactionalRepository}*/ productInventoryTransactionalRepository = undefined;

    @inject("ProductRepository")
    /** @type {ProductRepository}*/ productRepository = undefined;

    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    @inject("SettingsRepository")
    /**@type{SettingsRepository}*/ settingsRepository = undefined;

    change(productId, stockId, quantity) {

        const item = this.productInventoryTransactionalRepository.findOneByProductAndStock(productId, stockId),
            successResult = {success: true};

        if (!item)
            return this._itemIsNotExist(...arguments);

        let value = item.quantity + quantity;

        if (value >= 0) {
            this.productInventoryTransactionalRepository.update(item.id, {quantity: value});

            return successResult;
        }
        else
            return this._productIsExitOnStock(...arguments);
    }

    set(productId, stockId, quantity) {

        const item = this.productInventoryTransactionalRepository.findOneByProductAndStock(productId, stockId);

        if (!item)
            this.productInventoryTransactionalRepository.create({
                productId,
                stockId,
                quantity
            });

        this.productInventoryTransactionalRepository.update(item.id, {quantity});
    }

    _itemIsNotExist(productId, stockId, quantity) {

        if (quantity > 0) {
            this.productInventoryTransactionalRepository.create({
                productId,
                stockId,
                quantity
            });

            return {success: true};
        }


        return this._productIsExitOnStock(...arguments);

    }

    _productIsExitOnStock(productId, stockId) {

        const settings = this.settingsRepository.get();

        if (settings.canCreateSaleOnNoEnoughInventory)
            return {success: true};

        const product = this.productRepository.findById(productId),
            stock = this.stockRepository.findById(stockId);

        return {
            success: false,
            message: 'کالای "{0}" در انبار "{1}" به مقدار درخواست شده موجود نیست'.format(product.title, stock.title)
        };
    }

    start() {
        this.productInventoryTransactionalRepository.start();
    }

    commitChanges() {
        this.productInventoryTransactionalRepository.commit();
    }

    revertChanges(e) {
        this.productInventoryTransactionalRepository.rollback(e);
    }
}