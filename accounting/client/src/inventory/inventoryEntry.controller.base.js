class InventoryEntryControllerBase {

    constructor($scope,
                $state,
                $stateParams,
                logger,
                translate,
                inventoryApi,
                formService,
                devConstants,
                productCreateService) {

        this.$scope = $scope;
        this.$state = $state;
        this.logger = logger;
        this.translate = translate;
        this.inventoryApi = inventoryApi;
        this.formService = formService;
        this.isSaving = false;
        this.errors = [];
        this.inventory = {inventoryLines: []};
        this.isLoading = false;
        this.productCreateService = productCreateService;

        this.ioTypes = devConstants.enums.InventoryIOType().data;

        this.urls = {
            getAllProduct: devConstants.urls.products.getAllGoods(),
            getAllStocks: devConstants.urls.stock.getAll()
        };


        this.id = $stateParams.id;

        if (this.id)
            this.fetch();
    }

    fetch() {

    }

    createNewProduct(item, title) {

        this.productCreateService
            .show({title})
            .then(product => this.onProductChanged(item, product));
    }

    onProductChanged(item, product, form) {
        form.productId.$setViewValue(product.id);
        item.productId = product.id;
        item.scale = product.scaleDisplay;
    }

    addRow() {

        this.inventory.inventoryLines.push({
            productId: null,
            quantity: 1,
            unitPrice: 0,
        });
    }

    removeRow(item) {
        this.inventory.inventoryLines.asEnumerable().remove(item);
    }

    save(form) {
        if (form.$invalid) {
            this.formService.setDirty(form);
            this.formService.setDirtySubForm(form);
            throw new Error('The form has error');
        }

        this.errors = [];
        this.isSaving = true;
    }
}

export default InventoryEntryControllerBase;