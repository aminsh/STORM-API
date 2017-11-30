import InvoiceEntryControllerBase from './invoiceEntryController';


class SaleEntryController extends InvoiceEntryControllerBase {

    constructor($scope,
                $state,
                $stateParams,
                $timeout,
                logger,
                navigate,
                devConstants,
                promise,
                translate,
                settingsApi,
                inventoryApi,
                saleApi,
                formService,
                createPersonService,
                productCreateService,
                selectProductFromStockService) {

        super(
            $scope,
            $state,
            $stateParams,
            $timeout,
            logger,
            navigate,
            devConstants,
            promise,
            translate,
            settingsApi,
            saleApi,
            formService,
            createPersonService,
            productCreateService,
            selectProductFromStockService);

        this.pageTitle = this.onEditMode ? 'Edit sale' : 'Create sale';

        $scope.$watch(
            () => this.settings,
            this.assignDefaultDescription.bind(this)
        );

        this.inventoryApi = inventoryApi;
    }

    assignDefaultDescription() {

        if (!this.settings)
            return;

        if (this.onEditMode)
            return;

        if (this.invoice.description.length > 0)
            return;

        this.invoice.description = this.settings.invoiceDescription;
    }

    onShowSelectStock(item) {

        this.inventoryApi.getProductInventoryByStock(item.productId)
            .then(result => {
                item.inventories = result;
            });
    }

    onStockChanged(item, p) {
        item.stockId = p.stockId;
        item.stockDisplay = p.stockDisplay;
        item.stockInventory = p.sumQuantity;
    }

    onProductChanged(item, product, caller) {

        if (caller !== 'bound') {
            item.unitPrice = product.salePrice;

            item.stockId = null;
            item.stockDisplay = null;
        }

        item.canShowStockSection = this.settings.productOutputCreationMethod === 'stockOnRequest'
            && product.productType === 'good';

        super.onProductChanged(item, product);
    }


    goAfterSave() {
        this.$state.go('sale.sales');
    }

    addChange() {
        this.invoice.charges = this.invoice.charges || [];

        this.invoice.charges.push({});
    }

    removeCharge(item) {
        this.invoice.charges.asEnumerable().remove(item);
    }

    addCost() {
        this.invoice.costs = this.invoice.costs || [];

        this.invoice.costs.push({});
    }

    removeCost(item) {
        this.invoice.costs.asEnumerable().remove(item);
    }
}

export default SaleEntryController;