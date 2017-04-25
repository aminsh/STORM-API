"use strict";

export class ReportParametersController {
    constructor(
        data,
        formService,
        $uibModalInstance,
        generalLedgerAccountApi,
        subsidiaryLedgerAccountApi,
        detailAccountApi,
        dimensionCategoryApi,
        dimensionApi,
        $q) {

        this.paramsConfig = data;
        this.parameters = {
            generalLedgerAccounts: [],
            subsidiaryLedgerAccounts: [],
            detailAccounts: [],
            dimension1s: [],
            dimension2s: [],
            dimension3s: []
        };
        this.formService = formService;
        this.$uibModalInstance = $uibModalInstance;
        this.$q = $q;

        this.generalLedgerAccountApi = generalLedgerAccountApi;
        this.subsidiaryLedgerAccountApi = subsidiaryLedgerAccountApi;
        this.detailAccountApi = detailAccountApi;
        this.dimensionApi = dimensionApi;
        this.dimensionCategoryApi = dimensionCategoryApi;

        this.canShowContent = false;

        this.fetch();
    }

    fetch() {
        let dimensionCategories = this.dimensionCategoryApi.getAllLookupSync().data,
            promises = [
                { key: 'generalLedgerAccount', func: this.generalLedgerAccountApi.getAll() },
                { key: 'subsidiaryLedgerAccount', func: this.subsidiaryLedgerAccountApi.getAll() },
                { key: 'detailAccount', func: this.detailAccountApi.getAll() },
                { key: 'dimension1', func: this.dimensionApi.getByCategory(dimensionCategories[0].id) },
                { key: 'dimension2', func: this.dimensionApi.getByCategory(dimensionCategories[1].id) },
                { key: 'dimension3', func: this.dimensionApi.getByCategory(dimensionCategories[2].id) },
            ];

        this.$q.all(
            promises.asEnumerable()
                .select(p => p.func)
                .toArray())
            .then(result => {
                this.generalLedgerAccountDataSource = result[0].data;
                this.subsidiaryLedgerAccountDataSource = result[1].data;
                this.detailAccountDataSource = result[2].data;
                this.dimension1DataSource = result[3].data;
                this.dimension2DataSource = result[4].data;
                this.dimension3DataSource = result[5].data;

                this.canShowContent = true;

            });
    }

    hasProperty(propName) {
        return this.paramsConfig
            .asEnumerable()
            .any(p => p.name == propName);
    }

    isRequired(propName) {
        return this.paramsConfig
            .asEnumerable()
            .single(p => p.name == propName)
            .required;
    }

    go(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.$uibModalInstance.close(this.parameters);
    }

    close() {
        this.$uibModalInstance.dismiss();
    }
}

export function reportParametersModal(modalBase) {
    return modalBase({
        controller: 'reportParameterController',
        controllerAs: 'model',
        templateUrl: 'partials/reportParameters.html'
    });
}

