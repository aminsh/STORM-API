"use strict";

const ScaleRepository = require('./data').ScaleRepository,
    ProductRepository = require('./data').ProductRepository,
    String = instanceOf('utility').String;

class ProductService {
    constructor(branchId) {
        this.branchId = branchId;

        this.scaleRepository = new ScaleRepository(branchId);
    }

    create(cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {title: cmd.title};

        this.scaleRepository.create(entity);

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

        let entity = {title: cmd.title};

        this.scaleRepository.update(id, entity);

        return entity.id;
    }

    remove(id) {
        let errors = [];

        if(new ProductRepository(this.branchId).isExistsScale(id))
            errors.push('واحد اندازه گیری جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.scaleRepository.remove(id);
    }
}

module.exports = ProductService;