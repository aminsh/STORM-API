"use strict";

export default class createFiscalPeriodController {
    constructor($scope, formService, fiscalPeriodApi, navigate) {
        this.$scope = $scope;
        this.formService = formService;
        this.fiscalPeriodApi = fiscalPeriodApi;
        this.navigate = navigate;

        $scope.fiscalPeriod = {
            minDate: '',
            maxDate: ''
        };

        $scope.isSaving = false;
        $scope.save = this.save.bind(this);

        $scope.errors = [];

    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);
        this.$scope.isSaving = true;

        this.fiscalPeriodApi.create(this.$scope.fiscalPeriod)
            .then(result => {
                this.$scope.$emit('fiscal-period-changed', result);
                this.navigate('home');
            })
            .catch(err => this.$scope.errors = err)
            .finally(()=> this.$scope.isSaving = false);
    }
}