"use strict";

const ProductCategoryRepository = require('./data').ProductCategoryRepository,
    ProductRepository = require('./data').ProductRepository,
    String = instanceOf('utility').String;

class ProductService {
    constructor(branchId) {
        this.branchId = branchId;

        this.productCategoryRepository = new ProductCategoryRepository(branchId);
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
            title: cmd.title
        };

        this.productCategoryRepository.create(entity);

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
            title: cmd.title
        };

        this.productCategoryRepository.update(id, entity);

        return entity.id;
    }

    remove(id) {
        let errors = [];

        if (new ProductRepository(this.branchId).isExistsCategory(id))
            errors.push('گروه جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.remove(id);
    }


}

module.exports = ProductService;