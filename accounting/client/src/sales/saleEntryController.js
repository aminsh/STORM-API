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
    }

    onProductChanged(item, product) {
        item.unitPrice = product.salePrice;

        product.productType === 'good' && this.selectStock(item);

        super.onProductChanged(item, product);
    }

    goAfterSave(){
        this.$state.go('sale.sales');
    }

    canShowStock(){

        if(!this.settings)
            return super.canShowStock();

        return this.settings.productOutputCreationMethod === 'stockOnRequest';
    }
}

export default SaleEntryController;