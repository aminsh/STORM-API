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
                stockApi,
                returnSaleApi,
                productApi,
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

        this.isReturnSale = true;

        this.saleApi = saleApi;
        this.stockApi = stockApi;
        this.productApi = productApi;
    }

    onShowSelectStock(item) {

        if (!this.stocks)
            this.stockApi.getAll()
                .then(result => this.stocks = item.stocks = result.data.asEnumerable()
                    .select(item => ({
                        stockId: item.id,
                        display: item.title
                    })).toArray()
                );
        else
            item.stocks = this.stocks;
    }

    onProductChanged(item, product, caller) {

        if (caller !== 'bound') {

            item.stockId = null;
            item.stockDisplay = null;
        }

        item.canShowStockSection = this.settings.productOutputCreationMethod === 'stockOnRequest'
            && product.productType === 'good';

        if (item.canShowStockSection)
            this.onShowSelectStock(item);

        super.onProductChanged(item, product);
    }

    onSaleChanged(sale) {
        this.isLoading = true;

        this.saleApi.getById(sale.id)
            .then(result => {

                this.invoice.ofInvoiceId = result.id;
                this.invoice.detailAccountId = result.customerId;
                this.invoice.invoiceLines = result.invoiceLines;
                this.invoice.discount = result.discount;

                this.invoice.invoiceLines.forEach(line => {
                    if (!line.productId) return;

                    this.productApi.getById(line.productId)
                        .then(product => this.onProductChanged(line, product));
                })
            })
            .finally(() => this.isLoading = false);
    }

    goAfterSave() {
        this.$state.go('sale.returnSales');
    }

    get canShowInputSelector() {
        return true;
    }
}

export default ReturnSaleEntryController;