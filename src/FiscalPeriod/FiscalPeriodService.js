import {inject, injectable} from "inversify";

@injectable()
export class FiscalPeriodService {

    /** @type {FiscalPeriodRepository}*/
    @inject("FiscalPeriodRepository") fiscalPeriodRepository = undefined;

    create(cmd) {

        let errors = [],
            entity = {
                title: cmd.title,
                minDate: cmd.minDate,
                maxDate: cmd.maxDate,
                isClosed: false
            };

        if (Utility.String.isNullOrEmpty(entity.minDate))
            errors.push('از تاریخ نباید خالی باشد');

        if (Utility.String.isNullOrEmpty(entity.maxDate))
            errors.push('تا تاریخ نباید خالی باشد');

        if (entity.minDate > entity.maxDate)
            errors.push('تا تاریخ نباید بزرگتر از تا تاریخ باشد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.fiscalPeriodRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {

        const fiscalPeriod = this.fiscalPeriodRepository.findById(id);

        if (!fiscalPeriod)
            throw new NotFoundException();

        let errors = [],
            entity = {
                title: cmd.title,
                minDate: cmd.minDate,
                maxDate: cmd.maxDate,
                isClosed: false
            };

        if (Utility.String.isNullOrEmpty(entity.minDate))
            errors.push('از تاریخ نباید خالی باشد');

        if (Utility.String.isNullOrEmpty(entity.maxDate))
            errors.push('تا تاریخ نباید خالی باشد');

        if (entity.minDate > entity.maxDate)
            errors.push('تا تاریخ نباید بزرگتر از تا تاریخ باشد');

        this.fiscalPeriodRepository.update(id, entity);
    }

    remove(id){

        const fiscalPeriod = this.fiscalPeriodRepository.findById(id);

        if (!fiscalPeriod)
            throw new NotFoundException();

        if(this.fiscalPeriodRepository.isUsed(id));
            throw new ValidationException(['دوره مالی جاری در اسناد استفاده شده ، امکان حذف وجود ندارد']);

        this.fiscalPeriodRepository.remove(id);
    }
}
