import {inject, injectable} from "inversify";

@injectable()
export class InventoryService {

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    @inject("InputService")
    /**@type{InputService}*/ inputService = undefined;

    @inject("OutputService")
    /**@type{OutputService}*/ outputService = undefined;

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

    transferBetweenStocks(dto) {
        let errors = [];

        if (!dto.sourceStockId)
            errors.push('انبار مبدا وجود ندارد');

        if (!dto.destinationStockId)
            errors.push('انبار مقصد وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (dto.sourceStockId === dto.destinationStockId)
            errors.push('انبار مبدا و مقصد نباید یکی باشد');

        if (!(dto.lines && dto.lines.length > 0))
            errors.push('ردیف های کالا وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        errors = errors.concat(dto.lines.asEnumerable().selectMany(line => this._validateLines(line)).toArray());

        if (errors.length > 0)
            throw new ValidationException(errors);

        let output = {
            stockId: dto.sourceStockId,
            ioType: 'outputStockToStock',
            date: dto.date,
            lines: dto.lines
        };

        this.outputService.create(output);

        let input = {
            stockId: dto.destinationStockId,
            ioType: 'inputStockToStock',
            date: dto.date,
            lines: dto.lines
        };

        this.inputService.create(input);
    }

    _validateLines(line) {

        let errors = [];

        if (!line.productId)
            errors.push('کالا وجود ندارد');

        if (!(line.quantity && line.quantity !== 0))
            errors.push('مقدار کالا وجود ندارد');

        return errors;
    }
}