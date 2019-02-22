import {injectable, inject} from "inversify";
import {EventHandler} from "../Infrastructure/@decorators";

@injectable()
export class InventoryAccountingInputEventListener {

    @inject("InventoryAccountingRepository")
    /**@type{InventoryAccountingRepository}*/ inventoryAccountingRepository = undefined;

    @inject("InvoiceRepository")
    /**@type{InvoiceRepository}*/ invoiceRepository = undefined;

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @EventHandler("InventoryInputCreated")
    onInputCreated(id) {

       /* this.inventoryAccountingRepository.update(id, {priceStatus: 'draft'});

        const input = this.inventoryAccountingRepository.findById(id);

        if (!['firstInput', 'inputPurchase'].includes(input.ioType)) {

            const lines = output.inventoryLines
                .map(line => ({
                    id: line.id,
                    unitPrice: line.unitPrice,
                    price: this.inventoryAccountingRepository.getAveragePrice(line.id)
                }))
                .filter(line => line.unitPrice !== line.price);

            if (lines.length > 0)
                this.inventoryAccountingPricingService.outputSetPrice(output.id, lines.map(item => ({
                    id: item.id,
                    unitPrice: item.price
                })));
        }

        if (input.ioType === 'inputPurchase' && input.invoiceId)
            this._updatePrice(input);*/
    }

    @EventHandler("InventoryInputChanged")
    onInputChanged(oldInput, id) {

        /*const input = this.inventoryAccountingRepository.findById(id);

        if (!input.invoiceId)
            return;

        if (input.ioType !== 'inputPurchase')
            return;

        this._updatePrice(input);*/
    }

    @EventHandler("InventoryOutputCreated")
    onInventoryOutputCreated(output) {

        /*this.inventoryAccountingRepository.update(output.id, {priceStatus: 'draft'});

        const lines = output.inventoryLines
            .map(line => ({
                id: line.id,
                unitPrice: line.unitPrice,
                price: this.inventoryAccountingRepository.getAveragePrice(line.id)
            }))
            .filter(line => line.unitPrice !== line.price);

        if (lines.length > 0)
            this.inventoryAccountingPricingService.outputSetPrice(output.id, lines.map(item => ({
                id: item.id,
                unitPrice: item.price
            })));*/
    }

    @EventHandler("InventoryInputPriceChanged")
    onInputPriceChanged() {

        this.inventoryAccountingPricingService.calculatePrice();
    }

    @EventHandler("InventoryOutputPriceChanged")
    onOutputPriceChanged(id) {
        const output = this.inventoryAccountingRepository.findById(id);

        if (output.inventoryLines.asEnumerable().all(item => item.unitPrice > 0))
            this.inventoryAccountingRepository.update(id, {priceStatus: 'confirmed'});
    }

    _updatePrice(input) {

        const purchase = this.invoiceRepository.findById(input.invoiceId),
            totalPrice = purchase.invoiceLines.asEnumerable().sum(item => (item.unitPrice * item.quantity) - item.discount),
            totalCharges = (purchase.charges && purchase.charges.length > 0)
                ? purchase.charges.asEnumerable().sum(item => item.value)
                : 0;

        const lines = input.inventoryLines.map(item => {

            const purchaseLine = purchase.invoiceLines.asEnumerable().first(pl => pl.productId === item.productId),
                total = (purchaseLine.unitPrice * purchaseLine.quantity) - purchaseLine.discount,
                rate = (total * 100) / totalPrice,
                chargeShare = (totalCharges * rate) / 100,
                value = (total + chargeShare) / purchaseLine.quantity;

            return {id: item.id, unitPrice: value};
        });

        this.inventoryAccountingPricingService.inputEnterPrice(input.id, lines);
    }
}