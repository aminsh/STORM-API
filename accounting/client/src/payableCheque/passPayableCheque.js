"use strict";

export default class PassReceivableChequeController {
    constructor($scope, payableChequeApi, formService, devConstants, data) {

        this.$scope = $scope;
        this.payableChequeApi = payableChequeApi;
        this.formService = formService;

        this.isSaving = false;
        this.errors = [];
        this.id = data.id;

        this.passedModel = {
            date: null
        };
    }

    save(from) {
        if (from.$invalid)
            return this.formService.setDirty(from);

        this.isSaving = true;
        this.errors = [];

        this.payableChequeApi.passCheque(this.id, this.passedModel)
            .then(() => this.$scope.$close())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}