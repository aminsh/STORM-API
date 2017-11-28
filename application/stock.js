"use strict";

const StockRepository = require('./data').StockRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryRepository = require('./data').InventoryRepository,
    String = instanceOf('utility').String;

class ProductService {
    constructor(branchId) {
        this.branchId = branchId;

        this.stockRepository = new StockRepository(branchId);
    }

    create(cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            address: cmd.address
        };

        this.stockRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: cmd.title,
            address: cmd.address
        };

        this.stockRepository.update(id, entity);
    }

    remove(id) {

        if (new InventoryRepository(this.branchId).isExitsStock(id))
            throw new ValidationException('انباری جاری در اسناد انباری استفاده شده ، امکان حدف وجود ندارد');

        if (new InvoiceRepository(this.branchId).isExitsStock(id))
            throw new ValidationException('انباری جاری در فاکتورها استفاده شده ، امکان حدف وجود ندارد');

        this.stockRepository.remove(id);
    }
}

module.exports = ProductService;