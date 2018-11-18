import {inject, injectable} from "inversify";

@injectable()
export class StockService {

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {StockRepository}*/
    @inject("StockRepository") stockRepository = undefined;

    /** @type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    @inject("EventBus")
    /**@type{EventBus}*/ eventBus = undefined;

    create(cmd) {

        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            address: cmd.address,
            accountId: cmd.accountId
        };

        this.stockRepository.create(entity);

        this.eventBus.send("StockCreated", entity.id);

        return entity.id;
    }

    update(id, cmd) {

        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            address: cmd.address,
            accountId: cmd.accountId
        };

        this.stockRepository.update(id, entity);
    }

    remove(id) {

        if (this.inventoryRepository.isExitsStock(id))
            throw new ValidationException(['انباری جاری در اسناد انباری استفاده شده ، امکان حدف وجود ندارد']);

        if (this.invoiceRepository.isExitsStock(id))
            throw new ValidationException(['انباری جاری در فاکتورها استفاده شده ، امکان حدف وجود ندارد']);

        this.stockRepository.remove(id);
    }
}
