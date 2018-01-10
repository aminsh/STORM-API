import {inject, injectable} from "inversify";

@injectable()
export class FiscalPeriodDomainService {

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

        if(Utility.String.isNullOrEmpty(entity.minDate))
            errors.push('از تاریخ نباید خالی باشد');

        if(Utility.String.isNullOrEmpty(entity.maxDate))
            errors.push('تا تاریخ نباید خالی باشد');

        if (entity.minDate > entity.maxDate)
            errors.push('تا تاریخ نباید بزرگتر از تا تاریخ باشد');

        this.fiscalPeriodRepository.create(entity);

        return entity.id;
    }

    update(id, cmd) {

    }

    remove(id) {


    }
}
