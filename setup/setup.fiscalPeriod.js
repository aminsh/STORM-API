"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    moment = require('moment-jalaali'),
    knex = instanceOf('knex');

module.exports = async.result(function (branchId) {
    let date = moment(),
        year = date.jYear(),
        isLeap = moment.jIsLeapYear(year),
        maxDate = `${year}/12/${isLeap ? '30' : '29'}`,

        entity = {
            isClosed: false,
            title: `سال مالی منتهی به ${maxDate}`,
            minDate: `${year}/01/01`,
            maxDate: `${year}/12/${isLeap ? '30' : '29'}`,
            branchId
        };

    return await(knex('fiscalPeriods').insert(entity));
});