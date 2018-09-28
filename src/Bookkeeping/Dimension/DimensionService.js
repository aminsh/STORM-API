import {inject, injectable} from "inversify";

@injectable()
export class DimensionService {
    /** @type {DimensionRepository} */
    @inject("DimensionRepository") dimensionRepository = undefined;

    /** @type {DimensionCategoryRepository}*/
    @inject("DimensionCategoryRepository") dimensionCategoryRepository = undefined;

    mapToDimensionEntity(cmd) {
        return {
            id: cmd.id,
            code: cmd.code,
            title: cmd.title,
            description: cmd.description,
            isActive: true
        }
    }

    createDimension(categoryId, cmd) {
        let errors = [],
            entity = this.mapToDimensionEntity(cmd);

        if (!Utility.String.isNullOrEmpty(entity.code)) {
            let dimension = this.dimensionRepository.findByCode(entity.code, categoryId);

            if (dimension.length > 0)
                errors.push('کد تکراری است!');
        }

        if (Utility.String.isNullOrEmpty(entity.code))
            errors.push('کد نمی تواند خالی باشد!');

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نمی تواند خالی باشد!');
        else {
            if (cmd.title.length < 3)
                errors.push('عنوان نباید کمتر از ۳ حرف باشد!');
        }

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.dimensionCategoryId = categoryId;
        entity = this.dimensionRepository.create(entity);

        return entity.id;
    }

    updateDimension(id, cmd) {
        let errors = [],
            entity = this.dimensionRepository.findById(id);

        if (Utility.String.isNullOrEmpty(cmd.code))
            errors.push('کد نمی تواند خالی باشد!');

        if (!Utility.String.isNullOrEmpty(entity.code)) {
            let dimension = this.dimensionRepository.findByCode(entity.code, entity.dimensionCategoryId, id);

            if (dimension.length > 0)
                errors.push('کد تکراری است!');
        }

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان اجباری است!');
        else {
            if (cmd.title.length < 3)
                errors.push('عنوان حداقل باید ۳کاراکتر باشد!');
        }

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.title = cmd.title;
        entity.code = cmd.code;
        entity.description = cmd.description;

        return this.dimensionRepository.update(entity);
    }

    removeDimension(id) {
        let isExist = this.dimensionRepository.isExistDimensionInJournal(id),
            errors = [];

        if (isExist)
            errors.push('حساب تفصیل در سند شماره {0} استفاده شده است و قابل حذف نمی باشد!'
                .format(isExist.temporaryNumber));

        if (errors.length > 0)
            throw new ValidationException(errors);

        return this.dimensionRepository.remove(id);
    }

    activeDimension(id) {
        return this.dimensionRepository.update({id: id, isActive: true});
    }

    deActiveDimension(id) {
        return this.dimensionRepository.update({id: id, isActive: false});
    }

    createDimensionCategory(cmd) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نباید خالی باشد!');
        else {
            if (cmd.title.length < 3)
                errors.push('عنوان نباید کمتر از ۳ حرف باشد!');
        }

        if (errors.length > 0)
            throw new ValidationException(errors);

        return this.dimensionCategoryRepository.create({
            title: cmd.title
        });
    }

    updateDimensionCategory(id, cmd) {
        let errors = [];

        if (Utility.String.isNullOrEmpty(cmd.title))
            errors.push('عنوان نباید خالی باشد!');
        else {
            if (cmd.title.length < 3)
                errors.push('عنوان نباید کمتر از ۳ حرف باشد!');
        }

        if (errors.length > 0)
            throw new ValidationException(errors);

        return this.dimensionCategoryRepository.update({id: id, title: cmd.title});
    }

    removeDimensionCategory(id) {
        let isExist = this.dimensionCategoryRepository.isExistDimensionCategoryInDimension(id),
            errors = [];

        if (isExist)
            errors.push('حساب {0} در تفصیل کد {1} استفاده شده است و قابل حذف نمی باشد!'
                .format(isExist.title, isExist.code));

        return this.dimensionCategoryRepository.remove(id);
    }

}