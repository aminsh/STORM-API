"use strict";

const ProductRepository = require('./data').ProductRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryeRepository = require('./data').InventoryeRepository;

class ProductService {
    constructor(branchId) {
        this.branchId = branchId;

        this.productRepository = new ProductRepository(branchId);
    }

    shouldTrackInventory(productId) {
        return this.productRepository.isGood(productId);
    }

    findByIdOrCreate(cmd) {
        if (!cmd)
            return null;

        let entity;

        if (cmd.id) {
            entity = this.productRepository.findById(cmd.id);

            if (entity) return entity;
        }

        if (cmd.referenceId) {
            entity = this.productRepository.findByReferenceId(cmd.referenceId);

            if (entity) return entity;
        }

        if (!cmd.title)
            return null;

        entity = {
            title: cmd.title,
            productType: cmd.productType,
            referenceId: cmd.referenceId
        };

        const id = this.create(entity);

        return this.productRepository.findById(id);
    }

    create(cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.code) && this.productRepository.findByCode(cmd.code))
            errors.push('کد تکراری است');

        if (String.isNullOrEmpty(cmd.referenceId) && this.productRepository.findByReferenceId(cmd.referenceId))
            errors.push('کد مرجع تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            code: cmd.code,
            title: cmd.title,
            productType: cmd.productType,
            reorderPoint: cmd.reorderPoint,
            salePrice: cmd.salePrice,
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId
        };

        this.productRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {

        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length > 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (String.isNullOrEmpty(cmd.code) && this.productRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (String.isNullOrEmpty(cmd.referenceId) && this.productRepository.findByReferenceId(cmd.referenceId, id))
            errors.push('کد مرجع تکراری است');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            code: cmd.code,
            title: cmd.title,
            productType: cmd.productType,
            reorderPoint: cmd.reorderPoint,
            salePrice: cmd.salePrice,
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId
        };

        this.productRepository.update(id, entity);
    }

    remove(id) {
        let errors = [];

        if (new InvoiceRepository(this.branchId).isExistsProduct(id))
            errors.push('کالا / خدمات جاری در فاکتور ها استفاده شده ، امکان حذف وجود ندارد');

        if (new InventoryeRepository(this.branchId).isExistsProduct(id))
            errors.push('کالا / خدمات جاری در اسناد انباری استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.remove(id);
    }


}

module.exports = ProductService;