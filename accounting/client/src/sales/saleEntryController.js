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

        this.inventoryApi = inventoryApi;
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

    onProductChanged(item, product) {
        item.unitPrice = product.salePrice;

        item.canShowStockSection = this.canShowStock() && product.productType === 'good' && !this.isReturnSale;

        super.onProductChanged(item, product);
    }

    goAfterSave() {
        this.$state.go('sale.sales');
    }

    canShowStock() {

        if (!this.settings)
            return super.canShowStock();

        return this.settings.productOutputCreationMethod === 'stockOnRequest';
    }
}

export default SaleEntryController;