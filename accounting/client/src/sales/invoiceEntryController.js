import Guid from "guid";

export default class InvoiceEntryControllerBase {
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
                api,
                formService,
                createPersonService,
                productCreateService,
                selectProductFromStockService) {

        settingsApi.get().then(settings => this.settings = settings);
        this.api = api;

        this.urls = {
            getAllPeople: devConstants.urls.people.getAll(),
            getAllProduct: devConstants.urls.products.getAll()
        };

        this.onEditMode = $stateParams.id;
        this.id = $stateParams.id;

        if (this.onEditMode)
            this.fetchInvoice();
        else {
            this.invoice = {
                sumPaidAmount: null,
                sumRemainder: null,
                sumTotalPrice: null,
                number: null,
                date: localStorage.getItem('today'),
                description: '',
                invoiceLines: [],
                status: 'confirm',
                detailAccountId: ''
            };

            this.createInvoiceLine();

            this.api.getMaxNumber()
                .then(result => this.invoice.number = (result || 0) + 1);
        }

        this.isLoading = false;
        this.$scope = $scope;
        this.promise = promise;
        this.$state = $state;
        this.logger = logger;
        this.createPersonService = createPersonService;
        this.productCreateService = productCreateService;
        this.selectProductFromStockService = selectProductFromStockService;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
    }

    fetchInvoice() {

        this.isLoading = true;

        this.api.getById(this.id)
            .then(result => this.invoice = result)
            .finally(() => this.isLoading = false);
    }

    removeInvoiceLine(item) {
        this.invoice.invoiceLines.asEnumerable().remove(item);
    }

    createNewProduct(item, title) {

        this.productCreateService
            .show({title})
            .then(product => this.onProductChanged(item, product));
    }

    selectStock(invoiceLine) {
        this.selectProductFromStockService
            .show({
                productId: invoiceLine.productId,
                productDisplay: invoiceLine.description

            })
            .then(result => {
                if (result) {
                    invoiceLine.stockId = result.stockId;
                    invoiceLine.stockDisplay = result.stockDisplay;
                    invoiceLine.stockInventory = result.stockInventory;
                }
                else {
                    invoiceLine.stockId = null;
                    invoiceLine.stockDisplay = null;
                    invoiceLine.stockInventory = 0;
                }
            });
    }

    onProductChanged(item, product) {
        item.productId = product.id;
        item.description = product.title;
        item.scale = product.scaleDisplay;

        product.productType === 'good' && this.selectStock(item);

        this.onItemPropertyChanged(item);
    }

    createNewCustomer(title) {

        this.createPersonService.show({title})
            .then(result => this.invoice.detailAccountId = result.id);

    }

    createInvoiceLine() {

        let maxRow = this.invoice.invoiceLines.length === 0
            ? 0
            : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
            newInvoice = {
                id: Guid.new(),
                row: ++maxRow,
                productId: null,
                description: '',
                quantity: 1,
                vat: 0,
                discount: 0,
                unitPrice: 0,
                totalPrice: 0,
                stockInventory: 0
            };

        this.invoice.invoiceLines.push(newInvoice);
    }

    newInvoice() {
        this.$state.go('^.create')
    }

    saveInvoice(form, status) {
        let logger = this.logger,
            formService = this.formService,
            invoice = this.invoice;

        invoice.customer = {
            id: invoice.detailAccountId
        };

        invoice.invoiceLines.forEach(line => line.product = {id: line.productId});

        invoice.status = status || 'confirm';


        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        this.errors = [];

        let promise = this.onEditMode
            ? this.api.update(invoice.id, invoice)
            : this.api.create(invoice);

        promise
            .then(() => {
                logger.success();

                this.goAfterSave();
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    goAfterSave() {
        throw new Error('This method is not implemented');
    }

    print() {
        let invoice = this.invoice;
        let reportParam = {"id": invoice.id};
        this.navigate(
            'report.print',
            {key: 700},
            reportParam);
    }

    onItemPropertyChanged(item) {
        const vat = this.settings.vat;

        item.vat = ((item.unitPrice * item.quantity) - item.discount) * vat / 100;
    }
}
