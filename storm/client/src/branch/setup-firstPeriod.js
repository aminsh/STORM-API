"use strict";

import moment from 'moment-jalaali';

export default class SetupFirstPeriodController {
    constructor(fiscalPeriodApi, $state, setDirty) {
        this.fiscalPeriodApi = fiscalPeriodApi;
        this.$state = $state;
        this.setDirty = setDirty;

        let date = moment(),
            year = date.jYear(),
            isLeap = moment.jIsLeapYear(year),
            maxDate = `${year}/12/${isLeap ? '30' : '29'}`;

        this.fiscalPeriod = {
            title: `سال مالی منتهی به ${maxDate}`,
            minDate: `${year}/01/01`,
            maxDate: `${year}/12/${isLeap ? '30' : '29'}`
        };
    }

    save(form) {
        if (form.$invalid)
            return this.setDirty(form);

        this.fiscalPeriodApi.create(this.fiscalPeriod)
            .then(() => {
                this.$state.go('^.chartOfAccount');
            });
    }
}

SetupFirstPeriodController.$inject = ['fiscalPeriodApi', '$state', 'setDirty'];