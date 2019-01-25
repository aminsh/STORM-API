import {ProductCategoryRepository} from "./productCategory.repository";
import {ProductCategory} from "./productCategory.entity";
import {Product} from "./product.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {ProductCategoryCreateDTO, ProductCategoryUpdateDTO} from "./dto/productCategory.DTO";
import {Injectable} from "../Infrastructure/DependencyInjection";

@Injectable()
export class ProductCategoryService {
    constructor(private productCategoryRepository: ProductCategoryRepository) {
    }

    async create(dto: ProductCategoryCreateDTO): Promise<ProductCategory> {
        let entity = new ProductCategory();
        entity.title = dto.title;

        await this.productCategoryRepository.save(entity);

        return entity;
    }

    async update(id: string, dto: ProductCategoryUpdateDTO): Promise<ProductCategory> {
        let entity = await this.productCategoryRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        entity.title = dto.title;

        await this.productCategoryRepository.save(entity);

        return entity;
    }

    async remove(id: string): Promise<void> {
        let entity = await this.productCategoryRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const products: Product[] = await entity.products;

        if (products.length > 0)
            throw new BadRequestException(['گروه جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد']);

        await this.productCategoryRepository.remove(entity);
    }
}