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

    @inject("InventoryAccountingPricingService")
    /**@type{InventoryAccountingPricingService}*/ inventoryAccountingPricingService = undefined;

    @inject("State")
    /**@type{IState}*/ state = undefined;

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

    addOneFirstInput(productId, DTO) {

        let inputFirst = this.inventoryRepository.findFirst(DTO.stockId, this.state.fiscalPeriodId);

        if (!inputFirst) {
            const id = this.inputService.create({
                stockId: DTO.stockId,
                ioType: 'inputFirst',
                inventoryLines: [{productId, quantity: DTO.quantity}]
            });

            Utility.delay(500);

            this.inputService.confirm(id);

            Utility.delay(500);

            inputFirst = this.inventoryRepository.findById(id);
        }
        else {

            const line = inputFirst.inventoryLines.asEnumerable().singleOrDefault(item => item.productId === productId);

            if (line)
                line.quantity = DTO.quantity;
            else
                inputFirst.inventoryLines.push({productId, quantity: DTO.quantity});

            this.inputService.update(inputFirst.id, inputFirst);

            inputFirst = this.inventoryRepository.findById(inputFirst.id);
        }

        this.inventoryAccountingPricingService.inputEnterPrice(
            inputFirst.id,
            inputFirst.inventoryLines
                .filter(item => item.productId === productId)
                .map(item => Object.assign({}, item, {unitPrice: DTO.unitPrice})),
            true);
    }

    addToInputFirst(productId, data) {

        data.forEach(item => this.addOneFirstInput(productId, item));
    }


}