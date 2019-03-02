import { inject, injectable } from "inversify";

@injectable()
export class InputService {

    /** @type {IState}*/
    @inject("State") state = undefined;

    @inject("EventBus")
    /**@type{EventBus}*/ eventBus = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    @inject("InventoryControlTurnoverService")
    /**@type{InventoryControlTurnoverService}*/ inventoryControlTurnoverService = undefined;

    @inject("InventoryPricingRepository")
    /**@type {InventoryPricingRepository}*/ inventoryPricingRepository = undefined;

    @inject("JournalGenerationTemplateService")
    /**@type{JournalGenerationTemplateService}*/ journalGenerationTemplateService = undefined;

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/ inventoryIOTypeRepository = undefined;

    _mapToEntity(cmd) {
        return {
            id: cmd.id,
            time: cmd.id ? undefined : ( cmd.time || new Date ),
            stockId: cmd.stockId,
            sourceStockId: cmd.sourceStockId,
            delivererId: cmd.delivererId,
            invoiceId: cmd.invoiceId,
            date: cmd.date || Utility.PersianDate.current(),
            description: cmd.description,
            inventoryType: 'input',
            quantityStatus: 'draft',
            ioType: cmd.ioType,
            fiscalPeriodId: this.state.fiscalPeriodId,
            inventoryLines: ( cmd.inventoryLines || cmd.lines ).asEnumerable()
                .select(line => ( {
                    id: cmd.id,
                    productId: line.productId,
                    baseInventoryId: line.baseInventoryId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice || 0,
                    vat: line.vat,
                    tax: line.tax
                } ))
                .toArray()
        }
    }

    _validate(cmd) {
        let errors = [];

        if (cmd.ioType === 'inputFirst' && this.inventoryRepository.findFirst(cmd.stockId, this.state.fiscalPeriodId, cmd.id))
            errors.push('اول دوره برای انبار جاری قبلا صادر شده');

        if (Utility.String.isNullOrEmpty(cmd.stockId))
            errors.push('انبار وجود ندارد');

        if (!cmd.inventoryLines && cmd.inventoryLines.length === 0) {
            errors.push('ردیف ها وجود ندارد');
            return errors;
        }

        cmd.inventoryLines.forEach((line, i) => {
            const row = i + 1;

            if (Utility.String.isNullOrEmpty(line.productId))
                errors.push(`کالا وجود ندارد - ردیف {0}`.format(row));

            if (!( line.quantity && line.quantity > 0 ))
                errors.push(`مقدار وجود ندارد - ردیف {0}`.format(row));
        });

        const lastPrice = this.inventoryPricingRepository.findLast();

        if (!cmd.id) {
            if (lastPrice && cmd.date < lastPrice.toDate)
                throw new ValidationException([ 'صدور رسید در تاریخ قبل از قیمت گذاری امکان پذیر نیست' ]);
        }
        else {
            const input = this.inventoryRepository.findById(cmd.id);

            if (lastPrice && input.date < lastPrice.toDate)
                throw new ValidationException([ 'تغییر رسید در تاریخ های قبل از قیمت گذاری امکان پذیر نیست' ]);

            if (input.journalId)
                throw new ValidationException([ 'برای رسید جاری سند صادر شده امکان ویرایش وجود ندارد' ]);
        }

        return errors;
    }

    create(cmd) {

        let entity = this._mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        const number = this.inventoryRepository.inputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0;

        entity.number = number + 1;

        this.inventoryRepository.create(entity);

        if (cmd.status === 'confirmed')
            this.confirm(entity.id);


        return entity.id;
    }

    confirm(id) {

        const input = this.inventoryRepository.findById(id);

        if (!input)
            throw new NotFoundException();

        this.inventoryRepository.update(id, { quantityStatus: 'confirmed' });

        this.eventBus.send("InventoryInputCreated", id);
    }

    fix(id) {

        const input = this.inventoryRepository.findById(id);

        if (!input)
            throw new NotFoundException();

        this.inventoryRepository.update(id, { quantityStatus: 'fixed' });

        this.eventBus.send("InventoryInputFixed", id);
    }

    update(id, cmd) {

        cmd.id = id;

        let input = this.inventoryRepository.findById(id),
            errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (input.quantityStatus === 'fixed')
            throw new ValidationException([ 'رسید ثبت قطعی شده ، امکان تغییر وجود ندارد' ]);

        let removedLines = input.inventoryLines.asEnumerable()
            .where(inputLine => !cmd.inventoryLines.asEnumerable().any(line => line.id === inputLine.id))
            .select(item => ( {
                id: item.id,
                productId: item.productId,
                quantity: 0
            } ))
            .toArray();

        errors = this.inventoryControlTurnoverService.validateTurnover({
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()

            /* updated lines */
                .where(item => item.id && input.inventoryLines.asEnumerable().any(e => e.id === item.id))

                /* removed lines */
                .concat(removedLines)

                .select(item => ( {
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity
                } ))
                .toArray()
        });

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            number: cmd.ioType === input.ioType && cmd.stockId === input.stockId
                ? input.number
                : ( this.inventoryRepository.inputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0 ) + 1,
            date: cmd.date || Utility.PersianDate.current(),
            stockId: cmd.stockId,
            inventoryType: 'input',
            ioType: cmd.ioType,
            description: cmd.description
        };

        entity.inventoryLines = cmd.inventoryLines.asEnumerable()
            .select(line => ( {
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice
            } )).toArray();

        this.inventoryRepository.updateBatch(id, entity);

        if (cmd.status === 'confirmed' && input.quantityStatus === 'draft') {

            this.confirm(id);
        }

        if (input.quantityStatus === 'confirmed')
            this.eventBus.send("InventoryInputChanged", input, id);
    }

    remove(id) {

        let input = this.inventoryRepository.findById(id),

            errors = this.inventoryControlTurnoverService.validateTurnover({
                stockId: input.stockId,
                inventoryLines: input.inventoryLines.asEnumerable()
                    .select(item => ( {
                        id: item.id,
                        productId: item.productId,
                        quantity: 0
                    } ))
                    .toArray()
            });

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (input.quantityStatus === 'fixed')
            throw new ValidationException([ 'رسید ثبت قطعی شده ، امکان حذف وجود ندارد' ]);

        if(input.journalId)
            throw new ValidationException(['برای رسید جاری سند حسابداری صادر شده ، ابتدا سند حسابداری را حذف کنید ']);

        if (this.inventoryPricingRepository.isInventoryExist(id))
            throw new ValidationException([ 'رسید جاری در قیمت گذاری وجود دارد ، امکان حذف وجود ندارد' ]);

        this.inventoryRepository.remove(id);

        this.eventBus.send("InventoryInputRemoved", input);
    }

    setInvoice(id, invoiceId) {

        const input = this.inventoryRepository.findById(id);

        this.inventoryRepository.update(id, { invoiceId, quantityStatus: 'confirmed' });

        this.eventBus.send("InventoryInputChanged", input, id);
    }

    generateJournal(id) {
        let input = this.inventoryRepository.findById(id);

        if (!input)
            throw new NotFoundException();

        if (input.journalId)
            throw new ValidationException([ 'سند حسابداری قبلا صادر شده' ]);

        const hasZeroPrice = input.inventoryLines.asEnumerable().any(item => item.unitPrice === 0);

        if (hasZeroPrice)
            throw new ValidationException([ 'رسید جاری قیمت گذاری نشده ، امکان صدور سند حسابداری وجود ندارد' ]);

        const ioType = input.ioType
            ? this.inventoryIOTypeRepository.findById(input.ioType)
            : null;

        if (!ioType)
            throw new ValidationException([ 'رسید دارای نوع نمی باشد ، امکان صدور سند وجود ندارد' ]);

        if (!ioType.journalGenerationTemplateId)
            throw new ValidationException([ 'برای نوع رسید جاری الگوی صدور سند حسابداری وجود ندارد ، امکان صدور سند وجود ندارد' ]);

        const journalId = this.journalGenerationTemplateService.generate(ioType.journalGenerationTemplateId, id, 'Inventory');

        this.inventoryRepository.update(id, { journalId });
    }
}