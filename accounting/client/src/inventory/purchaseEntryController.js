import InvoiceEntryController from '../sales/invoiceEntryController';
import Guid from "guid";

class PurchaseEntryController extends InvoiceEntryController {
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
                stockApi,
                inventoryApi,
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
            purchaseApi,
            formService,
            createPersonService,
            productCreateService,
            selectProductFromStockService);

        this.pageTitle = this.onEditMode ? 'Edit purchase' : 'Create purchase';
        this.isPurchase = true;

        this.stockApi = stockApi;
        this.inventoryApi = inventoryApi;

        this.urls.getAllInputs = devConstants.urls.inventory.getAllInputsWithoutInvoice()
    }

    get selectProductTemplateName() {
        return 'partials/inventory/purchase.selectProduct.template.html';
    }

    onShowSelectStock() {

        if (!this.stocks)
            this.stockApi.getAll()
                .then(result => this.stocks = result.data);
    }

    onStockChanged(item, stock) {
        item.stockId = stock.id;
        item.stockDisplay = stock.title;
    }

    onProductChanged(item, product, caller) {

        if (caller !== 'bound') {

            item.stockId = null;
            item.stockDisplay = null;
        }

        item.canShowStockSection = this.settings.productOutputCreationMethod === 'stockOnRequest'
            && product.productType === 'good';

        super.onProductChanged(item, product);
    }

    onAddedInput(input) {
        this.invoice.inventoryIds = this.invoice.inventoryIds || [];

        if (!this.invoice.inventoryIds.asEnumerable().any(e => e === input.id))
            this.invoice.inventoryIds.push(input.id);

        this.inventoryApi.getById(input.id)
            .then(result => {
                this.invoice.invoiceLines = result.inventoryLines.asEnumerable()
                    .select(line => ({
                        id: Guid.new(),
                        productId: line.productId,
                        quantity: line.quantity,
                        inputId: input.id,
                        unitPrice: 0,
                        description: '',
                        vat: 0,
                        discount: 0,
                        totalPrice: 0,
                        stockId: result.stockId,
                        stockDisplay: result.stockDisplay,
                        stockInventory: 0
                    }))
                    .concat(this.invoice.invoiceLines.asEnumerable().where(e => e.productId).toArray())
                    .toArray()
            });
    }

    onRemovedInput(input) {

        this.invoice.inventoryIds.asEnumerable().remove(input.id);

        let lines = this.invoice.invoiceLines.asEnumerable()
            .where(line => line.inputId === input.id)
            .toArray();

        lines.forEach(line => this.invoice.invoiceLines.asEnumerable().remove(line));

        if (this.invoice.inventoryIds.length === 0 && this.invoice.invoiceLines.length === 0)
            this.createInvoiceLine();
    }

    get personTypePropertyName() {
        return 'vendor';
    }

    get personTypeTitle() {
        return 'Vendor';
    }

    goAfterSave() {
        this.$state.go('inventory.purchases');
    }

    canShowAddButton() {
        return !(this.invoice.inventoryIds && this.invoice.inventoryIds.length > 0)
    }
}

export default PurchaseEntryController;