import InvoiceListControllerBase from "./invoiceListController";

class SalesController extends InvoiceListControllerBase {

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
            'returnSale');

        this.createStateName = 'createReturnSale';
    }

    edit(current) {
        this.$state.go('editReturnSale', {id: current.id});
    }

    view(current){
        this.$state.go('viewReturnSale', {id: current.id});
    }
}

export default SalesController;