import {inject, injectable} from "inversify";

@injectable()
export class ProductInventoryService {

    @inject("ProductInventoryTransactionalRepository")
    /** @type {ProductInventoryTransactionalRepository}*/ productInventoryTransactionalRepository = undefined;

    @inject("ProductRepository")
    /** @type {ProductRepository}*/ productRepository = undefined;

    @inject("StockRepository")
    /**@type {StockRepository}*/ stockRepository = undefined;

    changedQuantity(productId, stockId, quantity) {

        let productInventory = this.productInventoryTransactionalRepository.findOneByProductAndStock(productId, stockId);

        if (!productInventory)
            this.productInventoryTransactionalRepository.create({
                productId,
                stockId,
                quantity
            });
        else
            this.productInventoryTransactionalRepository.update(productInventory.id, {quantity});
    }

    increaseQuantity(productId, stockId, quantity) {

        let productInventory = this.productInventoryTransactionalRepository.findOneByProductAndStock(productId, stockId);

        if (!productInventory)
            this.productInventoryTransactionalRepository.create({
                productId,
                stockId,
                quantity
            });
        else
            this.productInventoryTransactionalRepository.update(productInventory.id, {quantity: productInventory.quantity + quantity});
    }

    decreaseQuantity(productId, stockId, quantity) {

        let productInventory = this.productInventoryTransactionalRepository.findOneByProductAndStock(productId, stockId);

        if (quantity > productInventory.quantity) {

            const product = this.productRepository.findById(productInventory.productId),
                stock = this.stockRepository.findById(productInventory.stockId);

            return {
                success: false,
                message: 'کالای "{0}" در انبار "{1}" به مقدار درخواست شده موجود نیست'.format(product.title, stock.title)
            };
        }

        this.productInventoryTransactionalRepository.update(productInventory.id, {quantity: productInventory.quantity - quantity});

        return {success: true};
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