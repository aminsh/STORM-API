import { inject, injectable } from "inversify";

@injectable()
export class InventoryIOTypeService {

    @inject("InventoryIOTypeRepository")
    /**@type{InventoryIOTypeRepository}*/
    ioTypeRepository = undefined;

    create(DTO) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(DTO.type))
            throw new ValidationException('type is empty');

        if (![ 'input', 'output' ].includes(DTO.type))
            throw new ValidationException('type should be included [input,output]');

        if (Utility.String.isNullOrEmpty(DTO.title))
            errors.push('عنوان نباید خالی باشد');
        else if (DTO.title.length < 3)
            errors.push('عنوان نباید کمتر از 3 کاراکتر باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            title: DTO.title,
            type: DTO.type,
            journalGenerationTemplateId: DTO.journalGenerationTemplateId
        };

        this.ioTypeRepository.create(entity);

        return entity.id;
    }

    update(id, DTO) {
        let errors = [];

        let entity = this.ioTypeRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (Utility.String.isNullOrEmpty(DTO.type))
            throw new ValidationException('type is empty');

        if (![ 'input', 'output' ].includes(DTO.type))
            throw new ValidationException('type should be included [input,output]');

        if (Utility.String.isNullOrEmpty(DTO.title))
            errors.push('عنوان نباید خالی باشد');
        else if (DTO.title.length < 3)
            errors.push('عنوان نباید کمتر از 3 کاراکتر باشد');

        entity.title = DTO.title;
        entity.journalGenerationTemplateId = DTO.journalGenerationTemplateId;

        this.ioTypeRepository.update(id, entity);
    }

    remove(id) {
        let entity = this.ioTypeRepository.findById(id);

        if (!entity)
            throw new NotFoundException();

        if (this.ioTypeRepository.isReadOnly(id))
            throw new ValidationException([ 'نوع جاری قابل حذف نمیباشد' ]);

        if (this.ioTypeRepository.isUsed(id))
            throw new ValidationException([ 'نوع جاری در اسناد انباری استفاده شده ، امکان حذف وجود ندارد' ]);

        this.ioTypeRepository.remove(id);
    }
}