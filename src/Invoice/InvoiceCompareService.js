import {injectable} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class InvoiceCompareService extends BaseQuery {

    /*inventoryEnums = {
        input: {input: 'inputPurchase', output: 'outputReturnPurchase'},
        output: {input: 'inputBackFromSaleOrConsuming', output: 'outputSale'}
    };*/

    /*get(type, invoice) {

        const enums = this.inventoryEnums[type],
            rate = type === 'input' ? 1 : -1;

        const inventories = toResult(this.knex.from('inventories')
                .where({
                    invoiceId: invoice.id,
                    branchId: this.branchId
                })
            ),
            inventoryLines = toResult(this.knex.from('inventoryLines').whereIn('inventoryId', inventories.map(item => item.id))),
            flat = inventories.asEnumerable().join(
                inventoryLines,
                inventory => inventory.id,
                line => line.inventoryId,
                (inventory, line) => ({
                    id: inventory.id,
                    createdAt: inventory.createdAt,
                    inventoryType: inventory.inventoryType,
                    productId: line.productId,
                    stockId: inventory.stockId,
                    quantity: inventory.inventoryType === 'input' ? line.quantity : line.quantity * -1,

                }))
                .or
                .groupBy(item => item.productId, item => item, (productId, items) => ({
                    productId,
                    quantity: items.sum(p => p.quantity),
                    type: 'inventory'
                }))
                .toArray(),

            invoiceLines = invoice.invoiceLines.map(item => Object.assign({}, item, {
                quantity: item.quantity * rate,
                type: 'invoice'
            }));

        return flat.concat(invoiceLines)
            .asEnumerable()
            .groupBy(
                inventory => inventory.productId,
                invoice => invoice.productId,
                (productId, items) => {

                    let oldQuantity = 0, newQuantity = 0;

                    items.forEach(item => {
                        if (item.type === 'invoice')
                            newQuantity = item.quantity;
                        if (item.type === 'inventory')
                            oldQuantity = item.quantity;
                    });

                    return {
                        productId,
                        newQuantity,
                        oldQuantity,
                        difference: newQuantity - oldQuantity,
                        ioType: newQuantity - oldQuantity > 0 ? enums.input : enums.output
                    };
                })
            .toArray();
    }*/

    compare(baseType, oldLines, newLines) {

        const result = [],
            removedLines = oldLines.asEnumerable()
                .where(line => !newLines.asEnumerable().any(nl => nl.productId === line.productId))
                .toArray(),

            addedLines = newLines.asEnumerable()
                .where(line => !oldLines.asEnumerable().any(ol => ol.productId === line.productId))
                .toArray(),

            changedLines = newLines.asEnumerable()
                .join(
                    oldLines,
                    newLine => newLine.productId,
                    oldLines => oldLines.productId,
                    (newLine, oldLine) => ({
                        productId: newLine.productId,
                        oldStockId: oldLine.stockId,
                        newStockId: newLine.stockId,
                        oldQuantity: oldLine.quantity,
                        newQuantity: newLine.quantity
                    }))
                .where(line => line.oldStockId !== line.newStockId || line.oldQuantity !== line.newQuantity)
                .toArray();

        removedLines.forEach(item => result.push({
            stockId: item.stockId,
            productId: item.productId,
            quantity: item.quantity * (baseType === 'input' ? -1 : 1)
        }));

        addedLines.forEach(item => result.push({
            stockId: item.stockId,
            productId: item.productId,
            quantity: item.quantity * (baseType === 'input' ? 1 : -1)
        }));

        changedLines.forEach(item => {

            if (item.oldStockId === item.newStockId)
                result.push({
                    stockId: item.oldStockId,
                    productId: item.productId,
                    quantity: (item.oldQuantity - item.newQuantity) * (baseType === 'input' ? -1 : 1)
                });
            else {
                result.push({
                    stockId: item.oldStockId,
                    productId: item.productId,
                    quantity: item.oldQuantity * (baseType === 'input' ? -1 : 1)
                });

                result.push({
                    stockId: item.newStockId,
                    productId: item.productId,
                    quantity: item.newQuantity * (baseType === 'input' ? 1 : -1)
                });
            }
        });

        return result;
    }
}