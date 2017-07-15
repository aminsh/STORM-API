"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    moment = require('moment-jalaali'),
    FiscalPeriodRepository = require('../../../../accounting/server/data/repository.fiscalPeriod');

module.exports = async.result(function (branchId) {
    let fiscalPeriodRepository = new FiscalPeriodRepository(branchId),
        date = moment(),
        year = date.jYear(),
        isLeap = moment.jIsLeapYear(year),
        maxDate = `${year}/12/${isLeap ? '30' : '29'}`,

        entity = {
            isClosed: false,
            title: `سال مالی منتهی به ${maxDate}`,
            minDate: `${year}/01/01`,
            maxDate: `${year}/12/${isLeap ? '30' : '29'}`,
        };

    return fiscalPeriodRepository.create(entity)
});