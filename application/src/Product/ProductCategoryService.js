import {inject, injectable} from "inversify";

@injectable()
export class ProductCategoryService {

    /**@type {ProductCategoryRepository}*/
    @inject("ProductCategoryRepository") productCategoryRepository = undefined;

    /** @type {ProductRepository}*/
    @inject("ProductRepository") productRepository = undefined;

    create(cmd) {

        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
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

        if (Utility.String.isNullOrEmpty(cmd.title))
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

        if (this.productRepository.isExistsCategory(id))
            errors.push('گروه جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.productCategoryRepository.remove(id);
    }
}
