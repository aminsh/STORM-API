"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    Enums = instanceOf('Enums'),
    InventoryRepository = require('./data').InventoryRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    ProductService = require('./product');

class InventoryInputService {

    constructor(branchId, fiscalPeriodId) {

        this.fiscalPeriodId = fiscalPeriodId;
        this.branchId = branchId;

        this.inventoryRepository = new InventoryRepository(branchId);
        this.invoiceRepository = new InvoiceRepository(branchId);
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
    }

    _isValidInventoryTurnover(inventories) {
        if (inventories.length === 0) return true;

        let inventoryTurnover = inventories
            .map(item => {
                item.total = item.quantity * (item.inventoryType === 'input' ? 1 : -1);
                return item;
            })
            .reduce((memory, current) => {
                if (Array.isArray(memory)) {
                    let last = memory.asEnumerable().lastOrDefault(),
                        remainder = last ? last.remainder : 0;

                    current.remainder = remainder + current.total;
                    memory.push(current);
                    return memory;
                }
                else {
                    memory.remainder = memory.total;
                    current.remainder = memory.remainder + current.total;
                    return [memory, current];
                }
            });

        return inventoryTurnover.asEnumerable().all(item => item.remainder >= 0);
    }

    _validateTurnover(input) {
        let lines = input.inventoryLines,
            productService = new ProductService(this.branchId);

        return lines.asEnumerable()
            .where(item => item.id)
            .select(item => {
                let inventories = this.inventoryRepository.getInventoriesByProductId(item.productId, this.fiscalPeriodId, input.stockId),
                    current = inventories.asEnumerable().singleOrDefault(item => item.id === item.id);

                current.quantity = item.quantity;

                return {
                    isValid: this._isValidInventoryTurnover(inventories),
                    product: productService.findByIdOrCreate({id: item.productId})
                };
            })
            .where(item => !item.isValid)
            .select(item => 'برای کالای {0} موجودی منفی میشود'.format(item.product.title))
            .toArray();
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

    create(cmd) {

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        const number = this.inventoryRepository.inputMaxNumber(this.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0;

        let input = {
            number: number + 1,
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'input',
            ioType: cmd.ioType,
            fiscalPeriodId: this.fiscalPeriodId,
            description: cmd.description
        };

        input.inventoryLines = cmd.lines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
            })).toArray();

        this.inventoryRepository.create(input);

        return input.id;
    }

    update(id, cmd) {
        cmd.id = id;

        let input = this.inventoryRepository.findById(id);

        if (String.isNullOrEmpty(cmd.stockId))
            cmd.stockId = input.stockId;

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        errors = this._validateTurnover({
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()

            /* updated lines */
                .where(item => item.id && input.inventoryLines.asEnumerable().any(e => e.id === item.id))

                /* removed lines */
                .concat(input.inventoryLines.asEnumerable()
                    .where(inputLine => !cmd.inventoryLines.asEnumerable().any(line => line.id === inputLine.id))
                    .select(item => ({
                        productId: item.productId,
                        quantity: 0
                    }))
                    .toArray())
                .toArray()
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        input = {
            date: cmd.date || PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'input',
            description: cmd.description
        };

        input.inventoryLines = cmd.lines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity,
            })).toArray();

        this.inventoryRepository.updateBatch(id, input);
    }

    remove(id) {
        let input = this.inventoryRepository.findById(id),

            errors = this._validateTurnover({
                stockId: input.stockId,
                inventoryLines: input.inventoryLines.asEnumerable()
                    .select(item => ({
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
            id.forEach(id => this._setInvoice(id, invoiceId));

        this._setInvoice(id, invoiceId);
    }

    setJournal(id, journalId) {
        this.inventoryRepository.update(id, {journalId});
    }

    setPrice(id, lines) {
        let errors = [];

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

        this.inventoryRepository.updateBatch(id, {inventoryLines});
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
}

module.exports = InventoryInputService;