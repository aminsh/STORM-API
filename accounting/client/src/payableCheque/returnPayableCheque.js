"use strict";

export default class ReturnReceivableChequeController {
    constructor($scope, payableChequeApi, formService, data) {

        this.$scope = $scope;
        this.payableChequeApi = payableChequeApi;
        this.formService = formService;

        this.isSaving = false;
        this.errors = [];
        this.id = data.id;

        this.returnModel = {
            date: null
        };
    }

    save(from) {
        if (from.$invalid)
            return this.formService.setDirty(from);

        this.isSaving = true;
        this.errors = [];

        this.payableChequeApi.returnCheque(this.id, this.returnModel)
            .then(() => this.$scope.$close())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}