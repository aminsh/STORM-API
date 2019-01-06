import {inject, injectable} from "inversify";
import {ScaleRepository} from "./ScaleRepository";
import {Scale} from "./Scale";
import {EntityState} from "../Infrastructure/EntityState";
import {ProductRepository} from "./ProductRepository";

@injectable()
export class ScaleService {

    @inject("ScaleRepository")
    private scaleRepository: ScaleRepository;

    @inject("ProductRepository")
    private productRepository: ProductRepository;

    create(command: ScaleCommand): Scale {
        let errors: string[] = [];

        if (Utility.String.isNullOrEmpty(command.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (command.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = new Scale();
        entity.title = command.title;

        this.scaleRepository.save(entity, EntityState.CREATED);

        return entity;
    }

    update(command: ScaleCommand): Scale {

        let errors = [];

        let entity = this.scaleRepository.findById(command.id);

        if (!entity)
            throw new NotFoundException();

        if (Utility.String.isNullOrEmpty(command.title))
            errors.push('عنوان نمیتواند خالی باشد');
        else if (command.title.length < 3)
            errors.push('عنوان باید حداقل ۳ کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.title = command.title;

        this.scaleRepository.save(entity, EntityState.MODIFIED);

        return entity;
    }

    remove(id: string): void {
        let errors: string[] = [];
        const entity = this.scaleRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        const usedCurrentScale = this.productRepository.findOne({scale: entity});

        if (usedCurrentScale)
            errors.push('واحد اندازه گیری جاری در کالا / خدمات استفاده شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.scaleRepository.remove(entity);
    }
}