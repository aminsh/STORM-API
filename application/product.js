"use strict";

class Product {
    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

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

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            code: cmd.code,
            title: cmd.title,
            productType: cmd.productType || 'good',
            reorderPoint: cmd.reorderPoint,
            salePrice: cmd.salePrice,
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId,
            barcode: cmd.barcode

        };

        this.productRepository.create(entity);

        return entity.id;
    }

    createBatch(productsDTO) {
        productsDTO.forEach(item => item.errors = this._validate(item));

        let productIds = productsDTO.asEnumerable()
            .where(item => item.errors.length === 0)
            .select(item => this.create(item))
            .toArray();

        return productIds;
    }


    _validate(cmd, id) {
        let errors = [];

        if (String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!String.isNullOrEmpty(cmd.code) && this.productRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (!String.isNullOrEmpty(cmd.referenceId) && this.productRepository.findByReferenceId(cmd.referenceId, id))
            errors.push('کد مرجع تکراری است');

        return errors;
    }

    _mapToEntity(cmd) {

        let entity = {
            code: cmd.code,
            title: cmd.title,
            productType: cmd.productType,
            reorderPoint: cmd.reorderPoint,
            salePrice: cmd.salePrice,
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId,
            barcode: cmd.barcode
        };

        return JSON.parse(JSON.stringify(entity));
    }

    update(id, cmd) {

        if (String.isNullOrEmpty(id))
            throw new ValidationException(['کد کالا / خدمات مقدار ندارد']);

        const persistedProduct = this.productRepository.findById(id);

        if (!persistedProduct)
            throw new ValidationException(['کالا / خدمات وجود ندارد']);

        let product = Object.assign({}, persistedProduct, this._mapToEntity(cmd)),
            errors = this._validate(product, id);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.update(id, product);
    }

    remove(id) {
        let errors = [];

        if (new InvoiceRepository(this.branchId).isExistsProduct(id))
            errors.push('کالا / خدمات جاری در فاکتور ها استفاده شده ، امکان حذف وجود ندارد');

        if (new InventoryRepository(this.branchId).isExistsProduct(id))
            errors.push('کالا / خدمات جاری در اسناد انباری استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.remove(id);
    }

    _addToInventoryInputFirst(DTO, inputFirst) {

        if (!this.productRepository.isGood(DTO.productId))
            throw new ValidationException(['کالای جاری از نوع انباری نیست']);

        if (!(DTO.quantity && !isNaN(parseFloat(DTO.quantity)) && parseFloat(DTO.quantity) > 0 ))
            throw new ValidationException(['مقدار باید دارای مقدار بزرگتر از صفر باشد']);

        /*if (String.isNullOrEmpty(DTO.stockId))
            throw new ValidationException(['انبار تعیین نشده']);*/

        let lineMatchProduct = inputFirst.inventoryLines.asEnumerable().singleOrDefault(item => item.productId === DTO.productId);

        if (!lineMatchProduct) {
            lineMatchProduct = {productId: DTO.productId};
            inputFirst.inventoryLines.push(lineMatchProduct);
        }

        lineMatchProduct.quantity = parseFloat(DTO.quantity);
    }

    addManyToInventoryInputFirst(DTOs, stockId) {

        const fiscalPeriodId = this.fiscalPeriodId,
            inventoryService = new InventoryService(this.branchId, fiscalPeriodId);

        let inputFirst = inventoryService.getInputFirst(stockId);

        DTOs.forEach(DTO => this._addToInventoryInputFirst(DTO, inputFirst));

        inventoryService.update(inputFirst.id, inputFirst);

        inputFirst = inventoryService.inventoryRepository.findById(inputFirst.id);

        let setPriceList = inputFirst.inventoryLines.asEnumerable()
            .join(
                DTOs.asEnumerable().where(d => (isNaN(parseFloat(d.unitPrice)) ? 0 : parseFloat(d.unitPrice)) > 0).toArray(),
                first => first.productId,
                second => second.productId,
                (first, second) => ({
                    id: first.id,
                    unitPrice: isNaN(parseFloat(second.unitPrice)) ? 0 : parseFloat(second.unitPrice)
                }))
            .toArray();

        /*TODO this control disabled temporarily
            inventoryService.fixQuantity(inputFirst.id);*/
        inventoryService.setPrice(inputFirst.id, setPriceList);
    }


}

const ProductService = module.exports = Product;

const ProductRepository = require('./data').ProductRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryRepository = require('./data').InventoryRepository,
    InventoryService = require('./inventoryInput'),
    String = instanceOf('utility').String;




