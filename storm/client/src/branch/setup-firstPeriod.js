"use strict";

export default class SetupFirstPeriodController {
    constructor(fiscalPeriodApi, $state, setDirty) {
        this.fiscalPeriodApi = fiscalPeriodApi;
        this.$state = $state;
        this.setDirty = setDirty;

        this.fiscalPeriod = {
            minDate: '',
            maxDate: ''
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