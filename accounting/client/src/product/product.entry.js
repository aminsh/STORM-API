"use strict";

export default class ProductEntryController {
    constructor($scope,
                productApi,
                scaleApi,
                data,
                formService,
                devConstants,
                productCategoryApi,
                prompt,
                translate) {

        this.$scope = $scope;
        this.productApi = productApi;
        this.scaleApi = scaleApi;
        this.formService = formService;
        this.prompt = prompt;
        this.translate = translate;
        this.id = data.id;
        this.isSaving = false;
        this.errors = [];
        this.productTypes = devConstants.enums.ProductType().data;

        this.productCategoryApi = productCategoryApi;
        this.getAllProductCategoryUrl = devConstants.urls.productCategory.getAll();
        this.getAllScaleUrl = devConstants.urls.scale.getAll();

        if (this.id)
            productApi.getById(data.id)
                .then(result => this.product = result);
        else
            this.product = {
                referenceId: '',
                title: data.title || '',
                reorderPoint: 0,
                productType: 'good',
                salePrice: 0,
                categoryId: null,
                scaleId: null
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

    onCategoryChanged(category) {
        this.product.categoryId = category.id;
    }

    onCategoryCreated(value) {
        this.prompt({
            title: this.translate('New product category'),
            text: this.translate('Enter product category title'),
            defaultValue: value
        }).then(inputValue => {
            this.productCategoryApi.create({title: inputValue})
                .then(result => this.product.categoryId = result.id);
        });
    }

    onScaleChanged(scale) {
        this.product.scaleId = scale.id;
    }

    onScaleCreated(value) {
        this.prompt({
            title: this.translate('New scale'),
            text: this.translate('Enter scale title'),
            defaultValue: value
        }).then(inputValue => {
            this.scaleApi.create({title: inputValue})
                .then(result => this.product.scaleId = result.id);
        });
    }
}