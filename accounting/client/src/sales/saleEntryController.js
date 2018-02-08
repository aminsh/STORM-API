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
                selectProductFromStockService,
                confirmSavingInvoiceWithEffectsService,
                confirmWindowClosing) {

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
            selectProductFromStockService,
            confirmWindowClosing);

        this.pageTitle = this.onEditMode ? 'Edit sale' : 'Create sale';

        this.confirmSavingInvoiceWithEffectsService = confirmSavingInvoiceWithEffectsService;

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
                item.stocks = result.asEnumerable()
                    .select(item => ({
                        display: `${item.stockDisplay} - ${this.translate('Inventory quantity')} : ${item.sumQuantity}`,
                        stockId: item.stockId
                    }))
                    .toArray();
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

        if (item.canShowStockSection)
            this.onShowSelectStock(item);

        super.onProductChanged(item, product);
    }


    goAfterSave() {
        super.goAfterSave();

        this.$state.go('sale.sales');
    }

    addCost() {
        this.invoice.costs = this.invoice.costs || [];

        this.invoice.costs.push({});
    }

    removeCost(item) {
        this.invoice.costs.asEnumerable().remove(item);
    }

    canShowAddButton() {
        return true;
    }

    saveInvoice(form) {
        let args = arguments,
            formService = this.formService;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        if (!this.onEditMode || this.invoice.status === 'draft')
            return super.saveInvoice(...args);

        this.api.getCompareChangesEditingInvoice(this.invoice.id, this.invoice.invoiceLines)
            .then(result => {
                let haveOutput = result.output && result.output.length > 0,
                    haveInput = result.input && result.input.length > 0;
                if (result && (haveOutput || haveInput))
                    return this.confirmSavingInvoiceWithEffectsService
                        .show({effects: result, saveAction: () => super.saveInvoice(...args)});

                return super.saveInvoice(...args);

            });

    }
}

export default SaleEntryController;