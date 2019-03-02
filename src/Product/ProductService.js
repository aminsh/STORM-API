import { inject, injectable } from "inversify";

@injectable()
export class ProductService {

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    /**@type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    @inject("EventBus")
    /**@type{EventBus}*/ eventBus = undefined;

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

        const id = this.create(cmd);

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
            salePrice: isNaN(parseInt(cmd.salePrice)) ? 0 : parseInt(cmd.salePrice),
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId,
            barcode: cmd.barcode,
            stocks: ( cmd.stocks || [] ).map(s => ( {
                stockId: s.stockId,
                isDefault: s.isDefault
            } ))
        };

        this.productRepository.create(entity);

        this.eventBus.send("ProductCreated", entity.id);

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

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (cmd.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (!Utility.String.isNullOrEmpty(cmd.code) && this.productRepository.findByCode(cmd.code, id))
            errors.push('کد تکراری است');

        if (!Utility.String.isNullOrEmpty(cmd.referenceId) && this.productRepository.findByReferenceId(cmd.referenceId, id))
            errors.push('کد مرجع تکراری است');

        if(cmd.stocks && cmd.stocks.length > 0) {
            if(!cmd.stocks.asEnumerable().all(s => s.stockId))
                errors.push('مقدار انبار ها صحیح نیست');
        }

        return errors;
    }

    _mapToEntity(cmd) {

        let entity = {
            code: cmd.code,
            title: cmd.title,
            productType: cmd.productType,
            reorderPoint: cmd.reorderPoint,
            salePrice: isNaN(parseInt(cmd.salePrice)) ? 0 : parseInt(cmd.salePrice),
            categoryId: cmd.categoryId,
            scaleId: cmd.scaleId,
            referenceId: cmd.referenceId,
            barcode: cmd.barcode,
            accountId: cmd.accountId,
            stocks: cmd.stocks
        };

        return JSON.parse(JSON.stringify(entity));
    }

    update(id, cmd) {

        if (Utility.String.isNullOrEmpty(id))
            throw new ValidationException([ 'کد کالا / خدمات مقدار ندارد' ]);

        const persistedProduct = this.productRepository.findById(id);

        if (!persistedProduct)
            throw new ValidationException([ 'کالا / خدمات وجود ندارد' ]);

        let product = Object.assign({}, persistedProduct, this._mapToEntity(cmd)),
            errors = this._validate(product, id);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.update(id, product);
    }

    remove(id) {
        let errors = [];

        if (this.invoiceRepository.isExistsProduct(id))
            errors.push('کالا / خدمات جاری در فاکتور ها استفاده شده ، امکان حذف وجود ندارد');

        if (this.inventoryRepository.isExistsProduct(id))
            errors.push('کالا / خدمات جاری در اسناد انباری استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productRepository.remove(id);
    }

    /*TODO It should be moved to inventory */
    /*_addToInventoryInputFirst(DTO, inputFirst) {

        if (!this.productRepository.isGood(DTO.productId))
            throw new ValidationException(['کالای جاری از نوع انباری نیست']);

        if (!(DTO.quantity && !isNaN(parseFloat(DTO.quantity)) && parseFloat(DTO.quantity) > 0 ))
            throw new ValidationException(['مقدار باید دارای مقدار بزرگتر از صفر باشد']);

        /!*if (String.isNullOrEmpty(DTO.stockId))
            throw new ValidationException(['انبار تعیین نشده']);*!/

        let lineMatchProduct = inputFirst.inventoryLines.asEnumerable().singleOrDefault(item => item.productId === DTO.productId);

        if (!lineMatchProduct) {
            lineMatchProduct = {productId: DTO.productId};
            inputFirst.inventoryLines.push(lineMatchProduct);
        }

        lineMatchProduct.quantity = parseFloat(DTO.quantity);
    }

    addManyToInventoryInputFirst(DTOs, stockId) {

        let inputFirst = this.inventoryInputDomainService.getInputFirst(stockId);

        DTOs.forEach(DTO => this._addToInventoryInputFirst(DTO, inputFirst));

        this.inventoryInputDomainService.update(inputFirst.id, inputFirst);

        inputFirst = this.inventoryRepository.findById(inputFirst.id);

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

        /!*TODO this control disabled temporarily
            inventoryService.fixQuantity(inputFirst.id);*!/
        this.inventoryInputDomainService.setPrice(inputFirst.id, setPriceList);
    }*/
}





