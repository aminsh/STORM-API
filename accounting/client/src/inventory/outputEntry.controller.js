import InventoryEntryControllerBase from './inventoryEntry.controller.base';

class OutputEntryController extends InventoryEntryControllerBase {

    constructor($scope,
                $state,
                $stateParams,
                logger,
                translate,
                inventoryApi,
                formService,
                devConstants,
                productCreateService,
                confirmWindowClosing) {
        super(
            $scope,
            $state,
            $stateParams,
            logger,
            translate,
            inventoryApi,
            formService,
            devConstants,
            productCreateService,
            confirmWindowClosing);

        this.ioTypes = this.ioTypes.asEnumerable()
            .where(item => item.key.includes('output'))
            .toArray();

        if (!this.id) {
            this.inventory.stockId = $stateParams.stockId;
            inventoryApi.getOutputMaxNumber()
                .then(result => this.inventory.number = result + 1);
            this.inventory.date = localStorage.getItem('today');
        }

        this.inventoryType = 'output';

        this.pageTitle = this.id ? 'Edit output' : 'New output';

        if (!this.id)
            this.addRow();
    }

    fetch() {
        this.isLoading = true;

        this.inventoryApi.getById(this.id)
            .then(result => this.inventory = result)
            .finally(() => this.isLoading = false);
    }

    onProductChanged(item, product, form) {
        super.onProductChanged(item, product, form);

        this.fetchStockInventoryByRowAndProduct(item, product.id);
    }

    fetchStockInventoryByRowAndProduct(item, productId){
        this.inventoryApi.getProductInventoryByStock(productId)
            .then(result => {
                const inventory = result.asEnumerable().singleOrDefault(e => e.stockId === this.inventory.stockId);

                item.inventory = inventory ? inventory.sumQuantity : 0;
            });
    }

    onStockChanged(){
        this.inventory.inventoryLines.forEach(item => this.fetchStockInventoryByRowAndProduct(item, item.productId));
    }

    save(form) {
        super.save(form);

        const promise = this.id
            ? this.inventoryApi.updateOutput(this.id, this.inventory)
            : this.inventoryApi.createOutput(this.inventory);

        promise
            .then(() => {
                this.logger.success();
                this.$state.go('inventory.outputs');
                this.confirmWindowClosing.deactivate();
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }
}

export default OutputEntryController;