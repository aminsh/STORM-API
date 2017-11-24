"use strict";

const FiscalPeriodRepository = require('./data').FiscalPeriodRepository,
    String = instanceOf('utility').String;

class Fund {
    constructor(branchId) {
        this.branchId = branchId;
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
    }

    create(cmd) {

        let errors = [],
            entity = {
                title: cmd.title,
                minDate: cmd.minDate,
                maxDate: cmd.maxDate,
                isClosed: false
            };

        if(String.isNullOrEmpty(entity.minDate))
            errors.push('از تاریخ نباید خالی باشد');

        if(String.isNullOrEmpty(entity.maxDate))
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

module.exports = Fund;