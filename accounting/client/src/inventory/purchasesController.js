import InvoiceListControllerBase from "../sales/invoiceListController";

class PurchasesController extends InvoiceListControllerBase{

    constructor(translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                returnSaleApi,
                navigate,
                $scope) {

        super(translate,
            confirm,
            devConstants,
            logger,
            $timeout,
            $state,
            returnSaleApi,
            navigate,
            $scope,
            'purchase');

        this.createStateName = 'createPurchase';

        let detailAccountColumn = this.gridOption.columns.asEnumerable()
            .single(col => col.name === 'detailAccountId');

        detailAccountColumn.title = translate('Vendor');
    }

    edit(current) {
        this.$state.go('editPurchase', {id: current.id});
    }

    view(current) {
        this.$state.go('viewPurchase', {id: current.id});
    }
}

export default PurchasesController;