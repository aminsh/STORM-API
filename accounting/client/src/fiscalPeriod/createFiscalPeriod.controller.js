"use strict";

export default class CreateFiscalPeriodController {
    constructor($scope, formService, fiscalPeriodApi) {
        this.$scope = $scope;
        this.formService = formService;
        this.fiscalPeriodApi = fiscalPeriodApi;

        this.fiscalPeriod = {
            title: '',
            minDate: '',
            maxDate: ''
        };

        this.isSaving = false;
        this.errors = [];
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.isSaving = true;

        this.fiscalPeriodApi.create(this.fiscalPeriod)
            .then(result => {
                this.$scope.$emit('fiscal-period-changed', result);
                this.$scope.$close(result);
            })
            .catch(err => this.errors = err)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}