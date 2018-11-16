import {injectable, inject} from "inversify";

@injectable()
export class InventoryAccountingPricingService {

    @inject("InventoryAccountingRepository")
    /**@type{InventoryAccountingRepository}*/ inventoryAccountingRepository = undefined;

    @inject("EventBus")
    /**@type {EventBus}*/ eventBus = undefined;

    calculatePrice() {
        const inventories = this.inventoryAccountingRepository.findAll();

        inventories.asEnumerable()
            .orderBy(item => item.row)
            .forEach(item => {

                if (item.type === 'output')
                    item.price = this._calculateAvg(item, inventories);

                if (item.type === 'input' && !['firstInput', 'inputPurchase'].includes(item.ioType))
                    item.price = this._calculateAvg(item, inventories);

                if (item.type === 'input' && ['firstInput', 'inputPurchase'].includes(item.ioType))
                    item.price = item.unitPrice;

            });

        const firstZero = inventories.asEnumerable().orderBy(item => item.row).firstOrDefault(item => item.row === 0);

        inventories.asEnumerable()
            .where(item => (firstZero ? item.row < firstZero.row : true) && item.price !== item.unitPrice && item.priceStatus !== 'fixed')
            .groupBy(
                item => item.id,
                item => item,
                (id, items) => ({
                    id,
                    lines: items.select(i => ({id: i.lineId, unitPrice: i.price})).toArray()
                })
            )
            .forEach(item => this.outputSetPrice(item.id, item.lines));
    }

    _calculateAvg(item, inventories) {

        const baseQuery = inventories.asEnumerable().where(i => i.row < item.row && i.type === 'input' && i.productId === item.productId);

        return baseQuery.any(i => i.unitPrice === 0)
            ? 0
            : baseQuery.sum(i => i.quantity * i.unitPrice) / baseQuery.sum(i => i.quantity);
    }

    inputEnterPrice(id, lines, priceManuallyEntered = false) {

        let input = this.inventoryAccountingRepository.findById(id);

        if (!input)
            throw new NotFoundException();

        if (input.inventoryType !== 'input')
            throw new NotFoundException();

        if (input.priceStatus === 'fixed')
            throw new ValidationException(['رسید ثبت قطعی شده ، امکان تغییر وجود ندارد']);

        let errors = [];

        if (lines.asEnumerable().any(line => !line.id))
            errors.push('شناسه ردیف ها صحیح نیست');

        if (lines.asEnumerable().any(line => !(line.unitPrice && line.unitPrice > 0)))
            errors.push('قیمت ردیف ها صحیح نیست');

        lines.forEach(line => this.inventoryAccountingRepository.updateLine(line.id, {unitPrice: line.unitPrice}));

        input = this.inventoryAccountingRepository.findById(id);


        let data = {priceManuallyEntered};

        if (input.inventoryLines.asEnumerable().all(line => line.unitPrice > 0))
            data.priceStatus = 'confirmed';

        this.inventoryAccountingRepository.update(id, data);

        this.eventBus.send("InventoryInputPriceChanged", id);
    }

    outputSetPrice(id, lines) {

        lines.forEach(line => this.inventoryAccountingRepository.updateLine(line.id, {unitPrice: line.unitPrice}));

        this.eventBus.send("InventoryOutputPriceChanged", id);
    }
}


