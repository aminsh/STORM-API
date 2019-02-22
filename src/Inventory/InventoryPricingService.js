import { injectable, inject } from "inversify";

@injectable()
export class InventoryPricingService {
    @inject("InventoryRepository")
    /**@type {InventoryRepository}*/ inventoryRepository = undefined;

    @inject("StockRepository")
    /**@type{StockRepository}*/ stockRepository = undefined;

    @inject("InventoryPricingRepository")
    /**@type {InventoryPricingRepository}*/ inventoryPricingRepository = undefined;

    items = [];
    lastProducts = [];

    addOrUpdateLastProduct(productId, lastProduct) {
        let item = this.lastProducts.asEnumerable().firstOrDefault(e => e.productId === productId);

        if (item) {
            item.lastPrice = lastProduct.price;
            item.lastQuantity = lastProduct.quantity;
            return;
        }

        this.lastProducts.push({ lastPrice: lastProduct.price, lastQuantity: lastProduct.quantity, productId });
    }

    /**@param {{fromDate:string, toDate:string}} dto*/
    calculate(dto) {
        let inventories = this.inventoryRepository.findAllInventories({}, dto.stockIds, [ dto.fromDate, dto.toDate ]);

        const inventoryLines = this.inventoryRepository.findAllLinesByInventoryIds(inventories
                .filter(item => item.inventoryType === 'input')
                .map(item => item.id)),
            hasInputZeroPriceAndNotHaveBaseInventory = inventoryLines.asEnumerable()
                .any(item => item.unitPrice === 0 && !item.baseInventoryId);

        if (hasInputZeroPriceAndNotHaveBaseInventory)
            throw new ValidationException([ 'رسید های بدون قیمت وجود دارد ، ابتدا قیمت گذاری نمایید' ]);

        const lastPricing = ( this.inventoryPricingRepository.findLast() || {} ),
            lastInventories = (this.inventoryPricingRepository.findLastInventories() || []),
            parameters = [
                [ dto.fromDate, dto.toDate ],
                lastInventories.map(item => item.inventoryId)
            ],
            items = this.inventoryRepository.findInventoriesAndLinesFlatten(...parameters);

        this.items = items;

        if(items.length === 0)
            throw new ValidationException(['سندی برای قیمت گذاری وجود ندارد ']);

        this.lastProducts = lastPricing.products || [];

        items.asEnumerable()
            .groupBy(item => item.productId, item => item, (productId, items) => ( {
                productId,
                items: items.toArray()
            } ))
            .forEach(product => this.calculateByProduct(
                product.productId,
                product.items,
                ( lastPricing.products || [] ).asEnumerable().firstOrDefault(item => item.productId === product.productId)));

        items.filter(item => item.priceEnteredAutomatically)
            .forEach(item => {
                this.inventoryRepository.update(item.id, { priceEnteredAutomatically: true });
                this.inventoryRepository.updateLine(item.lineId, { unitPrice: item.unitPrice })
            });

        let inventoryPricing = {
                fromDate: dto.fromDate,
                toDate: dto.toDate
            },
            stocks = items.asEnumerable().select(item => item.stockId).distinct().select(stockId => ( { stockId } )).toArray(),
            products = this.lastProducts.map(p => ( {
                productId: p.productId,
                lastPrice: p.lastPrice,
                lastQuantity: p.lastQuantity
            } )),
            inventoryList = items.map(e => ( { inventoryId: e.id } ));

        this.inventoryPricingRepository.create(inventoryPricing, products, stocks, inventoryList);
    }

    getPrice(id, productId) {
        let item = this.items.asEnumerable().firstOrDefault(e => e.id === id && e.productId === productId);

        if (item)
            return item.unitPrice;

        item = this.inventoryRepository.findOneLine({ inventoryId: id, productId });

        return item ? item.unitPrice : 0;
    }

    avg(list) {
        let price = list.asEnumerable().sum(item => item.quantity * item.unitPrice);
        let quantity = list.asEnumerable().sum(item => item.quantity);

        return { price: price / quantity, quantity };
    }

    calculateByProduct(productId, items, lastPriceAndQuantity) {

        lastPriceAndQuantity = lastPriceAndQuantity || { lastPrice: 0, lastQuantity: 0 };

        let last = {
            price: lastPriceAndQuantity.lastPrice,
            quantity: lastPriceAndQuantity.lastQuantity
        };

        items.forEach(item => {
            if (item.type === 'output') {
                item.unitPrice = last.price;
                item.priceEnteredAutomatically = true;
                return;
            }

            if (item.type === 'input') {
                if (item.unitPrice) {
                    last = this.avg([
                        { quantity: last.quantity, unitPrice: last.price },
                        { quantity: item.quantity, unitPrice: item.unitPrice },
                    ]);
                }
                else {
                    if (!item.baseInventoryId)
                        throw new Error(`Price is zero no have base inventory - id : ${item.id} - lineId: ${item.lineId}`);

                    let price = this.getPrice(item.baseInventoryId, productId);

                    if (!price)
                        throw new Error(`Price is zero when has base inventory - id : ${item.id} - lineId: ${item.lineId}`);

                    item.unitPrice = price;
                    item.priceEnteredAutomatically = true;

                    last = this.avg([
                        { quantity: last.quantity, unitPrice: last.price },
                        { quantity: item.quantity, unitPrice: price },
                    ]);
                }
            }
        });

        this.addOrUpdateLastProduct(productId, last);
    }
}