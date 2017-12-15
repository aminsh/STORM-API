"use strict";

class InventoryInputService {

    constructor(branchId, fiscalPeriodId) {

        this.fiscalPeriodId = fiscalPeriodId;
        this.branchId = branchId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);

        this.inventoryControlService = new InventoryControlService(branchId, fiscalPeriodId);
    }

    _validate(cmd) {
        let errors = [];

        if (cmd.ioType === 'inputFirst' && this.inventoryRepository.findFirst(cmd.stockId, this.fiscalPeriodId, cmd.id))
            errors.push('اول دوره برای انبار جاری قبلا صادر شده');

        if (String.isNullOrEmpty(cmd.stockId))
            errors.push('انبار وجود ندارد');

        if (!cmd.inventoryLines && cmd.inventoryLines.length === 0)
            return errors;

        cmd.inventoryLines.forEach((line, i) => {
            const row = i + 1;

            if (String.isNullOrEmpty(line.productId))
                errors.push(`کالا وجود ندارد - ردیف {0}`.format(row));

            if (!(line.quantity && line.quantity > 0))
                errors.push(`مقدار وجود ندارد - ردیف {0}`.format(row));
        });

        return errors;
    }

    _validateTurnover(input) {
        return this.inventoryControlService.validateTurnover(input);
    }

    _setInvoice(id, invoiceId, ioType) {

        let inventory = this.inventoryRepository.findById(id),
            invoice = this.invoiceRepository.findById(invoiceId),

            ioTypeDisplay = Enums.InventoryIOType().getDisplay(ioType);

        inventory.invoiceId = invoice.id;
        inventory.description = 'بابت فاکتور {0} شماره {1}'.format(ioTypeDisplay, invoice.number);
        inventory.ioType = ioType;

        inventory.inventoryLines = inventory.inventoryLines.asEnumerable()
            .join(
                invoice.invoiceLines,
                inventoryLine => inventoryLine.productId,
                invoiceLine => invoiceLine.productId,
                (inventoryLine, invoiceLine) => ({
                    id: inventoryLine.id,
                    invoiceLineId: invoiceLine.id,
                }))
            .toArray();

        this.inventoryRepository.updateBatch(id, inventory);
    }

    _mapToEntity(cmd) {
        return {
            id: cmd.id,
            stockId: cmd.stockId,
            date: cmd.date || PersianDate.current(),
            description: cmd.description,
            inventoryType: 'input',
            ioType: cmd.ioType,
            fiscalPeriodId: this.fiscalPeriodId,
            inventoryLines: (cmd.inventoryLines || cmd.lines).asEnumerable()
                .select(line => ({
                    id: cmd.id,
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: 0
                }))
                .toArray()
        }
    }

    create(cmd) {

        const outputService = new OutputService(this.branchId, this.fiscalPeriodId);

        let entity = this._mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (entity.ioType === 'inputStockToStock') {

            entity.outputId = outputService.create({
                stockId: cmd.sourceStockId,
                date: entity.date,
                ioType: 'outputStockToStock',
                inventoryLines: entity.inventoryLines.asEnumerable()
                    .select(line => ({
                        productId: line.productId,
                        quantity: line.quantity
                    }))
                    .toArray()
            });
        }

        const number = this.inventoryRepository.inputMaxNumber(this.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0;

        entity.number = number + 1;

        this.inventoryRepository.create(entity);

        if (entity.outputId)
            outputService.setInput(entity.outputId, entity.id);

        return entity.id;
    }

    update(id, cmd) {
        cmd.id = id;

        let input = this.inventoryRepository.findById(id);

        if (input.fixQuantity)
            throw new ValidationException(['رسید ثبت تعدادی شده ، امکان ویرایش وجود ندارد']);

        if (String.isNullOrEmpty(cmd.stockId))
            cmd.stockId = input.stockId;

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let removedLines = input.inventoryLines.asEnumerable()
            .where(inputLine => !cmd.inventoryLines.asEnumerable().any(line => line.id === inputLine.id))
            .select(item => ({
                id: item.id,
                productId: item.productId,
                quantity: 0
            }))
            .toArray();

        errors = this._validateTurnover({
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()

            /* updated lines */
                .where(item => item.id && input.inventoryLines.asEnumerable().any(e => e.id === item.id))

                /* removed lines */
                .concat(removedLines)

                .select(item => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity
                }))
                .toArray()
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        input = {
            number: cmd.ioType === input.ioType && cmd.stockId === input.stockId
                ? input.number
                : (this.inventoryRepository.inputMaxNumber(this.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0) + 1,
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'input',
            ioType: cmd.ioType,
            description: cmd.description
        };

        input.inventoryLines = cmd.inventoryLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
            })).toArray();

        this.inventoryRepository.updateBatch(id, input);
    }

    remove(id) {
        let input = this.inventoryRepository.findById(id);

        if (input.fixQuantity)
            throw new ValidationException(['رسید ثبت تعدادی شده ، امکان حذف وجود ندارد']);

        let errors = this._validateTurnover({
            stockId: input.stockId,
            inventoryLines: input.inventoryLines.asEnumerable()
                .select(item => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: 0
                }))
                .toArray()
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.inventoryRepository.remove(id);
    }

    setInvoice(id, invoiceId) {
        if (Array.isArray(id))
            return id.forEach(id => this._setInvoice(id, invoiceId));

        this._setInvoice(id, invoiceId);
    }

    setJournal(id, journalId) {
        this.inventoryRepository.update(id, {journalId});
    }

    setPrice(id, lines) {
        let errors = [];

        let input = this.inventoryRepository.findById(id);

        if (!input.fixQuantity)
            throw new ValidationException(['رسید جاری ثبت مقداری نشده ، امکان ورود قیمت وجود ندارد']);

        lines.forEach((line, i) => {
            if (!(line.unitPrice && line.unitPrice > 0))
                errors.push('ردیف ... - قیمت باید مقداری مخالف صفر داشته باشد'.format(i + 1));
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        let inventoryLines = lines.asEnumerable()
            .select(line => ({
                id: line.id,
                unitPrice: line.unitPrice
            }))
            .toArray();

        this.inventoryRepository.updateBatch(id, {id, inventoryLines});
    }

    getInputFirst(stockId) {

        let first = this.inventoryRepository.findFirst(stockId, this.fiscalPeriodId);

        if (first) return first;

        first = {
            inventoryType: 'input',
            ioType: 'inputFirst',
            stockId,
            description: 'رسید اول دوره',
            inventoryLines: []
        };

        const id = this.create(first);

        return this.inventoryRepository.findById(id);
    }

    fixQuantity(id) {
        this.inventoryRepository.update(id, {fixQuantity: true});
    }

    fixAmount(id) {
        this.inventoryRepository.update(id, {fixAmount: true});
    }
}

const InputService = module.exports = InventoryInputService;

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    Enums = instanceOf('Enums'),
    InventoryRepository = require('./data').InventoryRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    OutputService = require('./inventoryOutput'),
    InventoryControlService = require('./inventoryControl');