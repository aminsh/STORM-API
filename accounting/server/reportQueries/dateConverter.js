"use strict";
const BaseQuery = require('../queries/query.base');

class DateConverter extends BaseQuery{
    constructor(branchId) {
        super(branchId);
    }

    timeStampToJalaliDate(timeStamp) {

        let year = timeStamp.getFullYear(),
            month = timeStamp.getMonth(),
            day = timeStamp.getDay(),
            jalaliDate = gregoryToJalaliDate(year, month, day);

        function gregoryToJalaliDate(year, month, day) {
            let gregoryMonthDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
                jalaliMonthDays = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29),

                gregoryYear = year - 1600,
                gregoryMonth = month - 1,
                gregoryDay = day - 1,
                gregoryDayNumber = 365 * gregoryYear + div(gregoryYear + 3, 4) - div(gregoryYear + 99, 100) + div(gregoryYear + 399, 400);

            for (var i = 0; i < gregoryMonth; ++i)
                gregoryDayNumber += gregoryMonthDays[i];

            if (gregoryMonth > 1 && ((gregoryYear % 4 == 0 && gregoryYear % 100 != 0) || (gregoryYear % 400 == 0)))
                gregoryDayNumber++;

            gregoryDayNumber += gregoryDay;

            let jalaliDayNumber = gregoryDayNumber - 79,
                j_np = div(jalaliDayNumber, 12053);

            jalaliDayNumber = jalaliDayNumber % 12053;

            let jalaliYear = 979 + 33 * j_np + 4 * div(jalaliDayNumber, 1461);
            jalaliDayNumber %= 1461;

            if (jalaliDayNumber >= 366) {
                jalaliYear += div(jalaliDayNumber - 1, 365);
                jalaliDayNumber = (jalaliDayNumber - 1) % 365;
            }

            for (var i = 0; i < 11 && jalaliDayNumber >= jalaliMonthDays[i]; ++i)
                jalaliDayNumber -= jalaliMonthDays[i];
            let jalaliMonth = i + 1,
                jalaliDay = jalaliDayNumber + 1;

            function div(x, y) {
                return Math.floor(x / y);
            }
                return jalaliYear + '/' + jalaliMonth + '/' + jalaliDay;
        };

        return jalaliDate;
    }
}
module.exports = DateConverter;