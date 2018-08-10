import {inject, injectable} from "inversify";

@injectable()
export class InventoryService {

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    @inject("InventoryIOTypeRepository")
    /** @type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    setInvoice(id, invoice, ioTypeId) {

        let ioType = ioTypeId ? this.inventoryIOTypeRepository.findById(ioTypeId) : undefined,

            ioTypeDisplay = ioType ? ioType.title : '';

        this.inventoryRepository.update(id, {
            invoiceId: invoice.id,
            description: 'بابت فاکتور {0} شماره {1}'.format(ioTypeDisplay, invoice.number),
            ioType: ioTypeId
        });
    }
}