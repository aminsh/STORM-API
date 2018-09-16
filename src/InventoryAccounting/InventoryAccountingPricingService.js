import {injectable, inject} from "inversify";

@injectable()
export class InventoryAccountingPricingService {

    @inject("InventoryAccountingRepository")
    /**@type{InventoryAccountingRepository}*/ inventoryAccountingRepository = undefined;

    calculate(dto) {

        if(!dto.maxDate)
            throw new ValidationException(['تاریخ انتهای دوره وجود ندارد']);

        const zeroPriceInputs = this.inventoryAccountingRepository.getZeroPriceOnInputs(dto.maxDate);

        if(zeroPriceInputs && zeroPriceInputs.length > 0)
            throw new ValidationException(['رسید با قیمت صفر وجود دارد']);

        const before = this.inventoryAccountingRepository.totalQuantityAndPriceOnFixedInputsByProduct(),
            inventories = this.inventoryAccountingRepository.findAllNotFixed();

        let byProduct = inventories.asEnumerable()
            .groupBy(
                item => item.productId,
                item => item,
                (productId, items) => ({
                    productId,
                    items: items.toArray()
                }))
            .toArray();

        byProduct.forEach(pro => {
            pro.items.reduce((memory, current) => {

                if (memory.type === 'output') {
                    const item = before.asEnumerable().single(b => b.productId === memory.productId);
                    memory.unitPrice = item.unitPrice;
                    memory.changed = true;

                    return item;
                }

                if (memory.type === 'input' && !['inputFirst', 'inputPurchase'].includes(memory.ioType)) {
                    const item = before.asEnumerable().single(b => b.productId === memory.productId);
                    memory.unitPrice = item.unitPrice;
                    memory.changed = true;

                    return item;
                }

                if (current.type === 'input' && ['inputFirst', 'inputPurchase'].includes(current.ioType))
                    return {
                        unitPrice: ((memory.quantity * memory.unitPrice) + (current.quantity * current.unitPrice)) / (memory.quantity + current.quantity),
                        quantity: memory.quantity + current.quantity
                    };

                current.unitPrice = memory.unitPrice;
                current.changed = true;

                return memory;

            });
        });

        const flatten = byProduct.asEnumerable()
            .selectMany(item => item.items);

        flatten
            .where(item => item.changed)
            .forEach(item => this.inventoryAccountingRepository.updateLine(item.lineId, {unitPrice: item.unitPrice}));

        if(dto.shouldFixAmount)
            flatten.forEach(item => this.inventoryAccountingRepository.update(item.id, {fixedAmount: true}));
    }
}