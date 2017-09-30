import InvoiceEntryControllerBase from './invoiceEntryController';


class ReturnSaleEntryController extends InvoiceEntryControllerBase {

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
                returnSaleApi,
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
            returnSaleApi,
            formService,
            createPersonService,
            productCreateService,
            selectProductFromStockService);

        this.pageTitle = this.onEditMode ? 'Edit return sale' : 'Create return sale';

        this.urls.getAllSales = devConstants.urls.sales.getAll();
        this.urls.getAllStocks = devConstants.urls.stock.getAll();

        this.isReturnSale = true;

        this.saleApi = saleApi;
    }

    onProductChanged(item, product) {
        item.unitPrice = product.salePrice;

        super.onProductChanged(item, product);
    }

    onSaleChanged(sale) {
        this.isLoading = true;

        this.saleApi.getById(sale.id)
            .then(result => {
                const number = this.invoice.number,
                    date = this.invoice.date;

                this.invoice = result;
                this.invoice.ofInvoiceId = result.id;
                this.invoice.id = null;
                this.invoice.status = 'confirm';
                this.invoice.number = number;
                this.invoice.date = date;
            })
            .finally(() => this.isLoading = false);
    }

    goAfterSave(){
        this.$state.go('sale.returnSales');
    }
}

export default ReturnSaleEntryController;