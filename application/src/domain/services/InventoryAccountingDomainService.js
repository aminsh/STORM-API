import {inject, injectable} from "inversify";

@injectable()
export class InventoryAccountingDomainService {

    @inject("UnitOfWork")
    /** @type {UnitOfWork} */ unitOfWork = undefined;

    @inject("InvoiceRepository")
    /** @type {InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("InventoryRepository")
    /** @type {InventoryRepository} */ inventoryRepository = undefined;

    /**
     * @param {{productIds: String[], stockIds: String[], minDate: String, maxDate: String}} dto
     **/
    pricing(dto) {
        let inventoryIds = [],
            idsHasNoPrice = [];

        let inventories = this.inventoryRepository.findAll(dto);

        if(inventories.length === 0)
            throw new ValidationException(['در بازه تاریخی مشخص شده هیچ رسید یا حواله ای پیدا نشد']);

        if(inventories.asEnumerable().any(item => !item.fixedQuantity))
            throw new ValidationException(['در بازه تاریخی مشخص شده رسید یا حواله ثبت مقداری نشده ، ابتدا کلیه رسید و حواله ها را ثبت مقدار کنید']);

        this.unitOfWork.start();

        try {



            dto.productIds = dto.productIds || this.inventoryRepository.findAllProduct(dto);

            dto.productIds.forEach(productId => {
                let result = this.pricingByProduct(
                    productId,
                    dto.stockIds,
                    dto.minDate,
                    dto.maxDate);

                inventoryIds = [...inventoryIds, ...result.allIds];
                idsHasNoPrice = [...idsHasNoPrice, ...result.inputsIdsHasNoPrice];
            });

            if (idsHasNoPrice.length > 0) {
                this.unitOfWork.rollback(idsHasNoPrice);
                return {idsHasNoPrice};
            }

            if(dto.canFixAmount)
                this.unitOfWork.getRepository("InventoryRepository").update(inventoryIds, {fixedAmount: true});

            this.unitOfWork.commit();
        }
        catch (e) {
            this.unitOfWork.rollback(e);
            throw new Error(e);
        }
    }

    /**
     * @param {String} productId
     * @param {String[]} stockIds
     * @param {String} minDate
     * @param {String} maxDate
     * */
    pricingByProduct(productId, stockIds, minDate, maxDate) {
        let lastPrice = 0,
            totalQuantity = 0,
            inventoryRepository = this.unitOfWork.getRepository("InventoryRepository"),
            inventories = inventoryRepository.findAll({
                productId,
                minDate,
                maxDate,
                stockIds
            }, ['date', 'number', 'inventories.createdAt']),

            setLastPrice = (quantity, price) => {
                lastPrice = ((lastPrice * totalQuantity) + (quantity * price)) / (totalQuantity + quantity);
                totalQuantity = totalQuantity + (quantity || 0);
            },
            inputsIdsHasNoPrice = [];

        inventories.forEach(inventory => {
            let line = inventory.inventoryLines[0];

            if (inventory.inventoryType === 'input' && inventory.ioType === 'inputFirst') {
                if (line.unitPrice && line.unitPrice > 0)
                    setLastPrice(line.quantity, line.unitPrice);
                else
                    return inputsIdsHasNoPrice.push(inventory.id);
            }

            if (inventory.inventoryType === 'input' && inventory.ioType === 'inputPurchase') {
                if (line.unitPrice && line.unitPrice > 0)
                    setLastPrice(line.quantity, line.unitPrice);
                else {
                    inputsIdsHasNoPrice.push(inventory.id);
                    return;
                }
            }

            if (inventory.inventoryType === 'input'
                && !['inputFirst', 'inputPurchase', 'inputBackFromSaleOrConsuming'].includes(inventory.ioType)) {

                if (line.unitPrice && line.unitPrice > 0)
                    setLastPrice(line.quantity, line.unitPrice);
                else {
                    setLastPrice(line.quantity, lastPrice);

                    line.unitPrice = lastPrice;
                    inventoryRepository.updateLines([{id: line.id, unitPrice: lastPrice}]);
                }
            }

            if (inventory.inventoryType === 'output') {
                line.unitPrice = lastPrice;
                inventoryRepository.updateLines([{id: line.id, unitPrice: lastPrice}]);
            }
        });

        return {allIds: inventories.map(item => item.id), inputsIdsHasNoPrice}

    }
}