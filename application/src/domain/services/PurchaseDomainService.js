import {injectable, inject} from "inversify";
import {BaseDomainService, whenPropertyChanged} from "./BaseDomainService";
import flatten from "flat";

@injectable()
export class PurchaseDomainService extends BaseDomainService {

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {InputPurchaseDomainService}*/
    @inject("InputPurchaseDomainService") inputPurchaseDomainService = undefined;

    /**@type {InventoryInputDomainService}*/
    @inject("InventoryInputDomainService") inventoryInputDomainService = undefined;

    @whenPropertyChanged("title")
    changedSourceDetailAccountId() {

    }

    mapToData(cmd) {
        return {
            id: cmd.id,
            date: cmd.date,
            number: cmd.number,
            title: cmd.title,
            detailAccountId: cmd.detailAccountId,
            detailAccount: {
                title: cmd.detailAccountDisplay,
                code: cmd.code
            },
            description: cmd.description,
            referenceId: cmd.referenceId,
            journalId: cmd.journalId,
            invoiceStatus: cmd.status,
            orderId: cmd.orderId,
            invoiceType: cmd.invoiceType,
            ofInvoiceId: cmd.ofInvoiceId,
            costs: cmd.costs,
            charges: JSON.stringify(cmd.charges || []),
            discount: cmd.discount,
            inventoryIds: cmd.inventoryId,
            invoiceLines: cmd.invoiceLines ? cmd.invoiceLines.asEnumerable()
                    .select(line => {
                        return {
                            id: line.id,
                            invoiceId: line.invoiceId,
                            productId: line.productId,
                            description: line.description,
                            unitPrice: line.unitPrice,
                            quantity: line.quantity,
                            discount: line.discount,
                            stockId: line.stockId,
                            vat: line.vat,
                            tax: line.tax
                        }
                    })
                    .toArray()
                : null
        }
    }

    update(id, cmd) {
        let dto = this.mapToData(cmd),
            errors = [];
        dto = flatten(dto);

        this.repository = this.invoiceRepository;
        this.execute(id, dto);

        let data = flatten.unflatten(this.data);
        dto = flatten.unflatten(dto);
        data.invoiceLines = dto.invoiceLines;

        if (data.invoiceStatus) {
            data.invoiceStatus === 'fixed' &&
            errors.push('فاکتور جاری قابل ویرایش نمیباشد');

            data.invoiceStatus = cmd.status !== 'draft' ? 'confirmed' : 'draft';
        }

        Object.keys(data).length && this.invoiceRepository.patch(id, data);

        Utility.delay(500);

        cmd.status !== 'draft' && this.updateInventoryPurchase(id);

        cmd.status !== 'draft' && this.eventBus.send("onPurchaseChanged", id);

        this.submitEvents();
    }

    updateInventoryPurchase(invoiceId) {
        let invoice = this.invoiceRepository.findById(invoiceId);

        invoice.inventoryIds && invoice.inventoryIds.length > 0
        && invoice.inventoryIds.forEach(item => this.inputPurchaseDomainService.update(item, invoice));

        let inventoryIds = invoice.inventoryIds && invoice.inventoryIds.length > 0
            ? invoice.inventoryIds
            : this.inputPurchaseDomainService.create(invoice);

        this.inventoryInputDomainService.setInvoice(inventoryIds, invoice.id, 'inputPurchase');

        this.invoiceRepository.update(invoiceId, {inventoryIds: JSON.stringify(inventoryIds)});
    }
}