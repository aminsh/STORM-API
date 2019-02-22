import {inject, injectable} from "inversify";

@injectable()
export class OutputService {

    /** @type {IState}*/
    @inject("State") state = undefined;

    @inject("EventBus")
    /**@type {EventBus}*/ eventBus = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    @inject("ProductRepository")
    /** @type {ProductRepository}*/ productRepository = undefined;

    @inject("StockRepository")
    /** @type {StockRepository}*/ stockRepository = undefined;

    @inject("InventoryControlTurnoverService")
    /**@type{InventoryControlTurnoverService}*/ inventoryControlTurnoverService = undefined;

    create(cmd) {

        let errors = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.state.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: this.productRepository.findById(item.productId),
                stock: this.stockRepository.findById(item.stockId)
            }))
            .select(item => 'کالای "{0}" در انبار "{1}" به مقدار تعیین شده موجود نیست'.format(item.product.title, item.stock.title))
            .toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        const number = this.inventoryRepository.outputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0;

        let output = {
            time: cmd.time || new Date,
            number: number + 1,
            date: cmd.date || Utility.PersianDate.current(),
            stockId: cmd.stockId,
            destinationStockId: cmd.destinationStockId,
            invoiceId: cmd.invoiceId,
            inventoryType: 'output',
            quantityStatus: 'draft',
            ioType: cmd.ioType,
            fiscalPeriodId: this.state.fiscalPeriodId
        };

        output.inventoryLines = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .groupBy(line => line.productId, line => line, (key, items) => ({
                productId: key,
                quantity: items.sum(e => e.quantity)
            }))
            .select(line => ({
                productId: line.productId,
                quantity: line.quantity
            })).toArray();

        if (!(output.inventoryLines && output.inventoryLines.length > 0))
            throw new ValidationException('ردیف های حواله وجود ندارد');

        this.inventoryRepository.create(output);

        if (cmd.status === 'confirmed')
            this.confirm(entity.id);

        return output.id;
    }

    update(id, cmd) {

        let output = this.inventoryRepository.findById(id);

        if(output.quantityStatus === 'fixed')
            throw new ValidationException(['حواله ثبت قطعی شده ، امکان تغییر وجود ندارد']);

        if (!output)
            throw new NotFoundException();

        /* for created lines */
        let errors = cmd.inventoryLines.asEnumerable()
            .where(item => !output.inventoryLines.asEnumerable().any(e => e.id === item.id))
            .select(item => ({
                productId: item.productId,
                stockId: cmd.stockId,
                hasInventory: this.inventoryRepository.getInventoryByProduct(item.productId, this.state.fiscalPeriodId, cmd.stockId) >= item.quantity
            }))
            .where(item => !item.hasInventory)
            .select(item => ({
                product: this.productRepository.findById(item.productId),
                stock: this.stockRepository.findById(item.stockId)
            }))
            .select(item => 'کالای "{0}" در انبار "{1}" به مقدار تعیین شده موجود نیست'.format(item.product.title, item.stock.title))
            .toArray();

        errors = this.inventoryControlTurnoverService.validateTurnover({
            stockId: cmd.stockId,
            inventoryLines: cmd.inventoryLines.asEnumerable()

            /* updated lines */
                .where(item => item.id && output.inventoryLines.asEnumerable().any(e => e.id === item.id))

                .select(item => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity
                }))
                .toArray()
        }).asEnumerable().concat(errors).toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            number: cmd.ioType === output.ioType && cmd.stockId === output.stockId
                ? output.number
                : (this.inventoryRepository.outputMaxNumber(this.state.fiscalPeriodId, cmd.stockId, cmd.ioType).max || 0) + 1,
            date: cmd.date || output.date,
            stockId: cmd.stockId,
            ioType: cmd.ioType,
            description: cmd.description
        };

        entity.inventoryLines = (cmd.lines || cmd.inventoryLines).asEnumerable()
            .groupBy(
                line => line.productId,
                line => line, (key, items) => ({
                    id: (items.asEnumerable().firstOrDefault(e => e.id) || {}).id,
                    productId: key,
                    quantity: items.sum(e => e.quantity)
                }))
            .select(line => ({
                id: line.id,
                productId: line.productId,
                quantity: line.quantity,
            }))
            .toArray();

        if (!(entity.inventoryLines && entity.inventoryLines.length > 0))
            throw new ValidationException('ردیف های حواله وجود ندارد');

        this.inventoryRepository.updateBatch(id, entity);

        if (cmd.status === 'confirmed' && output.quantityStatus === 'draft') {

            this.confirm(id);
        }

        if (input.quantityStatus === 'confirmed')
            this.eventBus.send("InventoryOutputChanged", output, entity);


    }

    confirm(id) {

        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new NotFoundException();

        this.inventoryRepository.update(id, {quantityStatus: 'confirmed'});

        this.eventBus.send("InventoryOutputCreated", output);
    }

    fix(id) {

        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new NotFoundException();

        this.inventoryRepository.update(id, {quantityStatus: 'fixed'});

        this.eventBus.send("InventoryOutputFixed", output);
    }

    remove(id) {

        let output = this.inventoryRepository.findById(id);

        if(output.quantityStatus === 'fixed')
            throw new ValidationException(['حواله ثبت قطعی شده ، امکان حذف وجود ندارد']);

        if (!output)
            throw new NotFoundException();

        this.inventoryRepository.remove(id);

        this.eventBus.send("InventoryOutputRemoved", output);
    }

    shipped(id) {

        let output = this.inventoryRepository.findById(id);

        if (!output)
            throw new NotFoundException();

        this.inventoryRepository.update(id, {shipped: true});

        this.eventBus.send("InventoryOutputShipped", output);
    }
}