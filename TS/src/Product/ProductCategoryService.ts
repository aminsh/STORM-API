import {inject, injectable} from "inversify";
import {ProductCategoryRepository} from "./ProductCategoryRepository";
import {ProductCategory} from "./ProductCategory";
import {EntityState} from "../Infrastructure/EntityState";
import {Product} from "./Product";

@injectable()
export class ProductCategoryService {

    @inject("ProductCategoryRepository")
    productCategoryRepository: ProductCategoryRepository;

    create(command: ProductCategoryCommand): ProductCategory {
        let errors = [];

        if (Utility.String.isNullOrEmpty(command.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (command.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = new ProductCategory();
        entity.title = command.title;

        this.productCategoryRepository.save(entity, EntityState.CREATED);

        return entity;
    }

    update(command: ProductCategoryCommand): ProductCategory {

        let entity = this.productCategoryRepository.findById(command.id);

        if (!entity)
            throw new NotFoundException();

        let errors = [];

        if (Utility.String.isNullOrEmpty(command.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (command.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.title = command.title;

        this.productCategoryRepository.save(entity, EntityState.MODIFIED);

        return entity;
    }

    remove(id: string) {

        let errors: string[] = [];

        let entity = this.productCategoryRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const products: Product[] = entity.getProducts();

        if (products.length > 0)
            errors.push('گروه جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productCategoryRepository.remove(entity);
    }
}