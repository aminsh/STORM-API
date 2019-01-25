import moment from "moment-jalaali";
import Number from "./NumberUtils";
import {StringUtils} from "./StringUtils";

export const PersianDate = {
    toDay() {
        return moment().format('jYYYY/jMM/jDD');
    },
    current: function () {
        return moment().format('jYYYY/jMM/jDD');
    },
    dateToWord(date) {
        const months = {
                1: "فروردین",
                2: "اردیبهشت",
                3: "خرداد",
                4: "تیر",
                5: "مرداد",
                6: "شهریور",
                7: "مهر",
                8: "آبان",
                9: "آذر",
                10: "دی",
                11: "بهمن",
                12: "اسفند"
            },
            fn = Number.digitToWord,
            dateSplit = date.split('/'),
            year = parseInt(dateSplit[0]),
            month = parseInt(dateSplit[1]),
            day = parseInt(dateSplit[2]);

        return StringUtils.format('{0} {1} ماه {2}', fn(day), months[month], fn(year));
    },
    getDate(date) {

        if (typeof date === 'string')
            date = new Date(date);

        let dateToString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        return moment(dateToString).format('jYYYY/jMM/jDD');
    }
};