import {Product, PRODUCT_TYPE} from "./Product";
import {ProductRepository} from "./ProductRepository";
import {EntityState} from "../Infrastructure/EntityState";
import {ProductCategoryRepository} from "./ProductCategoryRepository";
import {ScaleRepository} from "./ScaleRepository";
import {Not} from "typeorm";
import {Inject} from "../Infrastructure/DependencyInjection/index";
import {Service} from "../Infrastructure/Providers";

@Service()
export class ProductService {

    @Inject("ProductRepository")
    productRepository: ProductRepository;

    @Inject("ProductCategoryRepository")
    productCategoryRepository: ProductCategoryRepository;

    @Inject("ScaleRepository")
    scaleRepository: ScaleRepository;

    create(command: ProductCommand): Product {

        const errors = this.validate(command);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let product = new Product();

        product.code = command.code;
        product.title = command.title;
        product.productType = command.productType as PRODUCT_TYPE || PRODUCT_TYPE.GOOD;
        product.reorderPoint = command.reorderPoint;
        product.reference = command.referenceId;
        product.category = this.productCategoryRepository.findById(command.categoryId);
        product.scale = this.scaleRepository.findById(command.scaleId);
        product.barcode = command.barcode;
        product.accountId = command.accountId;

        this.productRepository.save(product, EntityState.CREATED);

        return product;
    }

    update(id: string, command: ProductCommand): void {

        const product = id ? this.productRepository.findById(id) : undefined;

        if (!product)
            throw new NotFoundException();

        const errors = this.validate(command);

        if (errors.length > 0)
            throw new ValidationException(errors);

        product.code = Utility.ifUndefined(command.code, product.code);
        product.title = Utility.ifUndefined(command.title, product.title);
        product.productType = Utility.ifUndefined(command.productType as PRODUCT_TYPE, product.productType);
        product.reorderPoint = Utility.ifUndefined(command.reorderPoint, product.reorderPoint);
        product.reference = Utility.ifUndefined(command.referenceId, product.reference);
        product.category = Utility.ifUndefined(command.categoryId ? this.productCategoryRepository.findById(command.categoryId) : undefined, product.category);
        product.scale = Utility.ifUndefined(command.scaleId ? this.scaleRepository.findById(command.scaleId) : undefined, product.scale);
        product.barcode = Utility.ifUndefined(command.barcode, product.barcode);
        product.accountId = Utility.ifUndefined(command.accountId, product.accountId);

        this.productRepository.save(product, EntityState.MODIFIED);
    }

    remove(id: string): void {

        const product = this.productRepository.findById(id);

        if (!product)
            throw new NotFoundException();

        this.productRepository.remove(product);
    }

    findOrCreate(command: ProductCommand): Product {

        if (!command)
            return null;

        let entity: Product;

        if (command.id) {
            entity = this.productRepository.findById(command.id);
            if (entity) return entity;
        }

        if (command.referenceId) {
            entity = this.productRepository.findOne({reference: command.referenceId});

            if (entity) return entity;
        }

        if (!command.title)
            return null;

        entity = this.create(command);

        return entity;

    }

    createBatch(command: ProductCommand[]): Product[] {

        let commandWithErrors = command.map(item => ({productCommand: item, errors: this.validate(item)}));

        return commandWithErrors
            .filter(item => item.errors.length === 0)
            .map(item => this.create(item.productCommand));
    }

    private validate(command: ProductCommand): string[] {
        let errors: string[] = [];

        if (Utility.String.isNullOrEmpty(command.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (command.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        const idCondition = command.id ? {id: Not(command.id)} : {};

        if (!Utility.String.isNullOrEmpty(command.code) && this.productRepository.findOne({code: command.code, ...idCondition}))
            errors.push('کد تکراری است');

        if (!Utility.String.isNullOrEmpty(command.referenceId) && this.productRepository.findOne({reference: command.referenceId, ...idCondition}))
            errors.push('کد مرجع تکراری است');

        return errors;
    }
}