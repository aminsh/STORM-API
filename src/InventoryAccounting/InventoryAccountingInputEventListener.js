import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryAccountingInputEventListener {

    @inject("InventoryAccountingRepository")
    /**@type{InventoryAccountingRepository}*/ inventoryAccountingRepository = undefined;

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @EventHandler("InventoryInputCreated")
    onInputCreated(id) {
        const input = this.inventoryAccountingRepository.findById(id);

        if (!input.invoiceId)
            return;

        if (input.ioType !== 'inputPurchase')
            return;

        this._updatePrice(input);
    }

    @EventHandler("InventoryInputChanged")
    onInputChanged(oldInput, id) {

        const input = this.inventoryAccountingRepository.findById(id);

        if (!input.invoiceId)
            return;

        if (input.ioType !== 'inputPurchase')
            return;

        this._updatePrice(input);
    }

    _updatePrice(input) {

        const purchase = this.invoiceRepository.findById(input.invoiceId),
            totalPrice = purchase.invoiceLines.asEnumerable().sum(item => (item.unitPrice * item.quantity) - item.discount),
            totalCharges = (purchase.charges && purchase.charges.length > 0)
                ? purchase.charges.asEnumerable().sum(item => item.value)
                : 0;

        input.inventoryLines.forEach(item => {

            const purchaseLine = purchase.invoiceLines.asEnumerable().first(pl => pl.productId === item.productId),
                total = (purchaseLine.unitPrice * purchaseLine.quantity) - purchaseLine.discount,
                rate = (total * 100) / totalPrice,
                chargeShare = (totalCharges * rate) / 100,
                value = (total + chargeShare) / purchaseLine.quantity;

            this.inventoryAccountingRepository.updateLine(item.id, {unitPrice: value});
        });
    }
}