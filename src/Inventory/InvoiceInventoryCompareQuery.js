import toResult from "asyncawait/await";
import {injectable} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class InvoiceInventoryCompareQuery extends BaseQuery {

    inventoryEnums = {
        input: {input: 'inputPurchase', output: 'outputReturnPurchase'},
        output: {input: 'inputBackFromSaleOrConsuming', output: 'outputSale'}
    };

    get(type, invoice) {

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
    }
}