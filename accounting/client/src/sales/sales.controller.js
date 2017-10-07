import InvoiceListControllerBase from "./invoiceListController";

class SalesController extends InvoiceListControllerBase {

    constructor(translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                saleApi,
                navigate,
                $scope) {

        super(translate,
            confirm,
            devConstants,
            logger,
            $timeout,
            $state,
            saleApi,
            navigate,
            $scope,
            'sales');

        this.createStateName = 'createSale';
    }

    edit(current) {
        this.$state.go('editSale', {id: current.id});
    }

    view(current) {
        this.$state.go('viewSale', {id: current.id});
    }
}

export default SalesController;