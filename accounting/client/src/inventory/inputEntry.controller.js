import InventoryEntryControllerBase from './inventoryEntry.controller.base';

class InputEntryController extends InventoryEntryControllerBase {

    constructor($scope,
                $state,
                $stateParams,
                logger,
                translate,
                inventoryApi,
                formService,
                devConstants,
                productCreateService) {
        super(
            $scope,
            $state,
            $stateParams,
            logger,
            translate,
            inventoryApi,
            formService,
            devConstants,
            productCreateService);

        this.ioTypes = this.ioTypes.asEnumerable()
            .where(item => item.key.includes('input'))
            .toArray();

        if (!this.id) {
            this.inventory.stockId = $stateParams.stockId;
            inventoryApi.getInputMaxNumber()
                .then(result => this.inventory.number = result + 1);
            this.inventory.date = localStorage.getItem('today');
        }


        this.inventoryType = 'input';

        this.pageTitle = this.id ? 'Edit input' : 'New input';

        if (!this.id)
            this.addRow();
    }

    fetch() {
        this.isLoading = true;

        this.inventoryApi.getById(this.id)
            .then(result => this.inventory = result)
            .finally(() => this.isLoading = false);
    }

    save(form) {
        super.save(form);

        if (this.inventory.ioType === 'inputStockToStock' && this.inventory.stockId === this.inventory.sourceStockId) {
            this.isSaving = false;
            this.errors.push(this.translate('Stock and Source stock is not allowed to be equal'));
            return;
        }

        const promise = this.id
            ? this.inventoryApi.updateInput(this.id, this.inventory)
            : this.inventoryApi.createInput(this.inventory);

        promise
            .then(() => {
                this.logger.success();
                this.$state.go('inventory.inputs');
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }
}

export default InputEntryController;