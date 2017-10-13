import InvoiceEntryController from '../sales/invoiceEntryController';

class PurchaseEntryController extends InvoiceEntryController{
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
                purchaseApi,
                formService,
                createPersonService,
                productCreateService,
                selectProductFromStockService){

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
            purchaseApi,
            formService,
            createPersonService,
            productCreateService,
            selectProductFromStockService);

        this.pageTitle = this.onEditMode ? 'Edit purchase' : 'Create purchase';
    }

    get personTypePropertyName(){
        return 'vendor';
    }

    get personTypeTitle(){
        return 'Vendor';
    }

    goAfterSave(){
        this.$state.go('inventory.purchases');
    }

    canShowStock(){
        return true;
    }
}

export default PurchaseEntryController;