import { Product, PRODUCT_TYPE } from "./product.entity";
import { ProductRepository } from "./product.repository";
import { ProductCategoryRepository } from "./productCategory.repository";
import { ScaleRepository } from "./scale.repository";
import { Not } from "typeorm";
import { ProductCreateDTO, ProductUpdateDTO } from "./dto/product.DTO";
import { ObjectUtils, StringUtils } from "../Infrastructure/Utility";
import { Injectable } from "../Infrastructure/DependencyInjection";
import { BadRequestException, NotFoundException } from "../Infrastructure/Exceptions";

@Injectable()
export class ProductService {
    constructor(private productRepository: ProductRepository,
                private productCategoryRepository: ProductCategoryRepository,
                private scaleRepository: ScaleRepository) {
    }

    async create(dto: ProductCreateDTO): Promise<Product> {
        const product = await this.factory(dto);

        const errors = await this.validate(product);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.productRepository.save(product);

        return product;
    }

    async update(dto: ProductUpdateDTO): Promise<Product> {

        const product = await this.productRepository.findById(dto.id);

        if (!product)
            throw new NotFoundException();

        product.code = ObjectUtils.ifUndefined(dto.code, product.code);
        product.title = ObjectUtils.ifUndefined(dto.title, product.title);
        product.productType = ObjectUtils.ifUndefined(dto.productType as PRODUCT_TYPE, product.productType);
        product.reorderPoint = ObjectUtils.ifUndefined(dto.reorderPoint, product.reorderPoint);
        product.reference = ObjectUtils.ifUndefined(dto.referenceId, product.reference);
        product.category = ObjectUtils.ifUndefined(dto.categoryId ? await this.productCategoryRepository.findById(dto.categoryId) : undefined, product.category);
        product.scale = ObjectUtils.ifUndefined(dto.scaleId ? await this.scaleRepository.findById(dto.scaleId) : undefined, product.scale);
        product.barcode = ObjectUtils.ifUndefined(dto.barcode, product.barcode);
        product.accountId = ObjectUtils.ifUndefined(dto.accountId, product.accountId);

        const errors = await this.validate(product);

        if (errors.length > 0)
            throw new BadRequestException(errors);

        await this.productRepository.save(product);

        return product;
    }

    async remove(id: string): Promise<void> {
        const product = await this.productRepository.findById(id);

        if (!product)
            throw new NotFoundException();

        await this.productRepository.remove(product);
    }

    async findOrCreate(dto: ProductUpdateDTO): Promise<Product> {

        if (!dto)
            return null;

        let entity: Product;

        if (dto.id) {
            entity = await this.productRepository.findById(dto.id);
            if (entity) return entity;
        }

        if (dto.referenceId) {
            entity = await this.productRepository.findOne({ reference: dto.referenceId });

            if (entity) return entity;
        }

        if (!dto.title)
            return null;

        entity = await this.create(dto);

        return entity;

    }

    async createBatch(dto: ProductCreateDTO[]): Promise<Product[]> {

        const productsPromise = await dto.map(async item => await this.factory(item)),
            products = await Promise.all(productsPromise);

        const productWithErrorsPromise = products.map(async item => ({
                product: item,
                errors: await this.validate(item)
            })),
            productWithErrors = await Promise.all(productWithErrorsPromise);

        productWithErrors
            .filter(item => item.errors.length === 0)
            .forEach(async item => await this.productRepository.save(item.product));

        return productWithErrors
            .filter(item => item.errors.length === 0)
            .map(item => item.product);
    }

    private async validate(entity: Product): Promise<string[]> {
        let errors: string[] = [];

        const idCondition = entity.id ? { id: Not(entity.id) } : {};

        if (!StringUtils.isNullOrEmpty(entity.code) && await this.productRepository.findOne({ code: entity.code, ...idCondition }))
            errors.push('کد تکراری است');

        if (!StringUtils.isNullOrEmpty(entity.reference) && await this.productRepository.findOne({ reference: entity.reference, ...idCondition }))
            errors.push('کد مرجع تکراری است');

        return errors;
    }

    private async factory(dto: ProductCreateDTO): Promise<Product> {
        let product = new Product();

        product.code = dto.code;
        product.title = dto.title;
        product.productType = dto.productType as PRODUCT_TYPE || PRODUCT_TYPE.GOOD;
        product.reorderPoint = dto.reorderPoint;
        product.reference = dto.referenceId;
        product.category = dto.categoryId ? await this.productCategoryRepository.findById(dto.categoryId) : undefined;
        product.scale = dto.scaleId ? await this.scaleRepository.findById(dto.scaleId) : undefined;
        product.barcode = dto.barcode;
        product.accountId = dto.accountId;

        return product;
    }
}