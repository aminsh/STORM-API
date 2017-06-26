"use strict";

export default class ReturnReceivableChequeController {
    constructor($scope, receivableChequeApi, formService, data) {

        this.$scope = $scope;
        this.receivableChequeApi = receivableChequeApi;
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

        this.receivableChequeApi.returnCheque(this.id, this.returnModel)
            .then(() => this.$scope.$close())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}