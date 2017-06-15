import Guid from "guid";

export default class purchaseController {
    constructor(navigate,
                purchaseApi,
                translate,
                peopleApi,
                devConstants,
                logger,
                formService,
                $timeout,
                $scope,
                $state,
                promise,
                createPersonService,
                productCreateService) {

        this.urls = {
            getAllPeople: devConstants.urls.people.getAll(),
            getAllProduct: devConstants.urls.product.getAll()
        };
        this.$scope = $scope;
        this.promise = promise;
        this.$state = $state;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.createPersonService = createPersonService;
        this.productCreateService = productCreateService;
        this.purchaseApi = purchaseApi;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: [],
            detailAccountId: null,
            referenceId: null
        };
        this.isLoading = false;

        this.id = this.$state.params.id;

        if (this.id != undefined)
            $scope.editMode = true;

        if ($scope.editMode) {
            this.purchaseApi.getById(this.id)
                .then(result => this.invoice = result);
        }

        this.newInvoice();
    }


    removeInvoiceLine(item) {
        this.invoice.invoiceLines.asEnumerable().remove(item);
    }


    createNewProduct(item, title) {
        return this.promise.create((resolve, reject) => {
            this.productCreateService.show({title})
                .then(result => {
                    item.productId = result.id;
                    item.description = title;
                    resolve({id: result.id, title});
                });
        });
    }

    onProductChanged(item, product){
        item.description = product.title;
    }

    createNewCustomer(title) {
        return this.promise.create((resolve, reject) => {
            this.createPersonService.show({title})
                .then(result => {
                    this.invoice.detailAccountId = result.id;
                    resolve({id: result.id, title})
                });
        });
    }

    createInvoiceLine() {

        let maxRow = this.invoice.invoiceLines.length == 0
                ? 0
                : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
            newInvoice = {
                id: Guid.new(),
                row: ++maxRow,
                itemId: null,
                description: '',
                quantity: 0,
                vat: 0,
                discount: 0,
                unitPrice: 0,
                totalPrice: 0,
            };

        this.invoice.invoiceLines.push(newInvoice);
    }

    newInvoice() {
        this.isLoading = false;
        this.invoice = {
            number: null,
            date: localStorage.getItem('today'),
            description: '',
            invoiceLines: [],
            status: 'confirm',
            detailAccountId: null
        };

        this.createInvoiceLine();
    }

    saveInvoice(form) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice;

        if (status)
            invoice.status = status;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        errors.asEnumerable().removeAll();
        if (this.editMode == true) {
            return this.purchaseApi.update(invoice.id, invoice)
                .then(result => {
                    logger.success();
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        } else {

            return this.purchaseApi.create(invoice)
                .then(result => {
                    logger.success();
                    invoice.id = result.id;
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        }
    }

    print() {
        let invoice = this.invoice;
        let reportParam = {"id": invoice.id};
        this.navigate(
            'report.print',
            {key: 701},
            reportParam);
    }

    onItemPropertyChanged(item) {
        item.vat = ((item.unitPrice * item.quantity) - item.discount) * 9 / 100;
    }
}
