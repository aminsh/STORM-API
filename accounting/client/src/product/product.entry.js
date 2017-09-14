"use strict";

export default class ProductEntryController {
    constructor($scope,
                $rootScope,
                $timeout,
                productApi,
                scaleApi,
                data,
                formService,
                devConstants,
                productCategoryApi,
                inventoryApi,
                prompt,
                translate) {

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.productApi = productApi;
        this.inventoryApi = inventoryApi;
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
        this.getAllStockUrl = devConstants.urls.stock.getAll();

        this.isFirstInputActive = false;
        this.activeTab = 0;

        if (this.id)
            productApi.getById(this.id)
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

        this.firstInput = [];
    }

    save(form) {
        if (form.$invalid) {
            this.formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => this.formService.setDirty(form[key]));
            return this.validate();
        }

        if (!this.validate())
            return;

        this.errors = [];
        this.isSaving = true;

        let promise = this.id
            ? this.productApi.update(this.id, this.product)
            : this.productApi.create(this.product);

        promise
            .then(result => {
                this.$rootScope.$broadcast('onProductChanged');

                this.id = this.id ? this.id : result.id;

                if (this.isFirstInputActive)
                    this.sendFirstInput()
                        .then(() => this.$scope.$close(result))
                        .catch(errors => this.errors = errors);
                else
                    this.$scope.$close();
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    validate() {
        if (!this.product.title) {
            this.errors = [''];
            this.activeTab = 0;
            return false;
        }

        if (!this.isFirstInputActive)
            return true;

        const isNullAnyOfFirstInputProps = this.firstInput.asEnumerable()
            .any(item => Object.keys(item).asEnumerable().any(key => item[key] === null));

        if (isNullAnyOfFirstInputProps) {
            this.errors = [];
            this.$timeout(() => this.errors = ['']);
            this.activeTab = 1;
            return;
        }

        const isZeroAnyOfFirstInputProps = this.firstInput.asEnumerable()
            .any(item => Object.keys(item).asEnumerable()
                .any(key => item.unitPrice === 0 || item.quantity === 0));

        if (isZeroAnyOfFirstInputProps) {
            this.errors = [];
            this.$timeout(() => this.errors = ['']);

            this.activeTab = 1;
            return false;
        }

        const isStockIdDuplicated = this.firstInput.asEnumerable()
            .groupBy(
                item => item.stockId,
                item => item.stockId,
                (key, items) => ({key, isBiggerThanOne: items.count() > 1}))
            .any(item => item.isBiggerThanOne);

        if (isStockIdDuplicated) {
            this.errors = [];
            this.$timeout(() => this.errors = [this.translate('Stock is duplicated')]);

            this.activeTab = 1;
            return false;
        }

        return true;
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

    onStockChanged(item, stock) {
        item.stockId = stock.id;
    }

    onFirstInputClicked() {
        this.isFirstInputActive = !this.isFirstInputActive;
    }

    addFirstInput() {
        this.firstInput.push({
            stockId: null,
            unitPrice: null,
            quantity: null
        });
    }

    toggleFirstInput() {
        this.isFirstInputActive = !this.isFirstInputActive;

        this.$timeout(() => {
            if (this.isFirstInputActive) {
                this.activeTab = 1;
                this.addFirstInput();
            } else {
                this.activeTab = 0;
                this.firstInput = [];
            }
        });
    }

    canShowFirstInput() {
        if (!this.product) {
            this.isFirstInputActive = false;
            return false;
        }

        if (this.product.productType === 'service') {
            this.isFirstInputActive = false;
            return false;
        }

        if (!this.isFirstInputActive)
            return false;

        return true;
    }

    removeFirstInput(item) {
        this.firstInput.asEnumerable().remove(item);
    }

    sendFirstInput() {
        const cmd = {productId: this.id, data: this.firstInput};

        return this.inventoryApi.addToFirstInput(cmd);
    }

}