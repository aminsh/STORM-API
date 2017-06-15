"use strict";

export default class ProductEntryController {
    constructor($scope, productApi, data, formService, devConstants) {
        this.$scope = $scope;
        this.productApi = productApi;
        this.formService = formService;
        this.id = data.id;
        this.isSaving = false;
        this.errors = [];
        this.productTypes = devConstants.enums.ProductType().data;

        if (this.id)
            productApi.getById(data.id)
                .then(result => this.product = result);
        else
            this.product = {
                code: '',
                title: data.title || '',
                reorderPoint: 0,
                productType: 'good',
                salePrice: 0
            };
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        let promise = this.id
            ? this.productApi.update(this.id, this.product)
            : this.productApi.create(this.product);

        promise
            .then(result => this.$scope.$close(result))
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}