import {inject, injectable} from "inversify";

@injectable()
export class PriceListService {

    @inject("PriceListRepository")
    /**@type{PriceListRepository}*/priceListRepository = undefined;

    /**@type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    create(cmd) {

        let errors = [];

        if (!cmd.title)
            errors.push("عنوان نمیتواند خالی باشد");

        if (errors.length > 0)
            throw new ValidationException(errors);

        const entity = {
            title: cmd.title
        };

        this.priceListRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {
        let errors = [];

        const priceList = this.priceListRepository.findById(id);

        if (!priceList)
            throw new NotFoundException();

        if (!cmd.title)
            errors.push("عنوان نمیتواند خالی باشد");

        if (errors.length > 0)
            throw new ValidationException(errors);

        const entity = {
            title: cmd.title
        };

        this.priceListRepository.update(id, entity);
    }

    remove(id) {

        const priceList = this.priceListRepository.findById(id);

        if (!priceList)
            throw new NotFoundException();

        if (priceList.isDefault)
            throw new ValidationException(['لیست قیمت پیش فرض نمیتواند حذف شود']);

        this.priceListRepository.remove(id);
    }

    addToList(id, cmd) {
        let errors = [];

        const priceList = this.priceListRepository.findById(id);

        if (!priceList)
            throw new NotFoundException();

        if (!cmd.productId)
            errors.push("کالا/خدمات نمیتواند خالی باشد");
        else {
            const product = this.productRepository.findById(cmd.productId);

            if (!product)
                errors.push("کالا/خدمات نمیتواند خالی باشد");
        }

        if (!cmd.price || isNaN(cmd.price))
            errors.push("مبلغ نمیتواند خالی باشد");

        if (errors.length > 0)
            throw new ValidationException(errors);

        const priceListLine = this.priceListRepository.findProduct(id, cmd.productId);

        if (priceListLine)
            throw new ValidationException(['کالا/خدمات جاری در این لیست قیمت قبلا وجود دارد']);

        this.priceListRepository.createProduct(id, {productId: cmd.productId, price: cmd.price});
    }

    updatePrice(id, cmd) {

        const priceList = this.priceListRepository.findById(id);

        if (!priceList)
            throw new NotFoundException();

        let errors = [];

        cmd.price = parseFloat(cmd.price);

        if (!cmd.productId)
            errors.push("کالا/خدمات نمیتواند خالی باشد");
        else {
            const product = this.productRepository.findById(cmd.productId);

            if (!product)
                errors.push("کالا/خدمات نمیتواند خالی باشد");
        }

        if (!cmd.price || isNaN(cmd.price))
            errors.push("مبلغ نمیتواند خالی باشد");

        if (errors.length > 0)
            throw new ValidationException(errors);

        const priceListLine = this.priceListRepository.findProduct(id, cmd.productId);

        if (!priceListLine)
            throw new ValidationException(['کالا/خدمات در این لیست قیمت وجود ندارد']);

        this.priceListRepository.updateProduct(priceListLine.id, {price: cmd.price});
    }

    removeFromList(id, productId) {

        const priceList = this.priceListRepository.findById(id);

        if (!priceList)
            throw new NotFoundException();

        let errors = [];

        if (!productId)
            errors.push("کالا/خدمات نمیتواند خالی باشد");
        else {
            const product = this.productRepository.findById(productId);

            if (!product)
                errors.push("کالا/خدمات نمیتواند خالی باشد");
        }

        if (errors.length > 0)
            throw new ValidationException(errors);

        const priceListLine = this.priceListRepository.findProduct(id, productId);

        if (!priceListLine)
            throw new ValidationException(['کالا/خدمات در این لیست قیمت وجود ندارد']);

        this.priceListRepository.removeProduct(priceListLine.id);
    }
}