import Guid from "guid";

export default class invoiceController {
    constructor(navigate,
                devConstants,
                saleApi,
                purchaseApi,
                translate,
                peopleApi,
                logger,
                formService,
                $state,
                $timeout,
                $scope,
                promise,
                createPaymentService,
                createPersonService,
                productCreateService) {


        let regex = /^([^.]*)/;
        let strToMatch = $state.current.name;
        let invoiceType = regex.exec(strToMatch)[0];


        this.urls = {
            getAllPeople: devConstants.urls.people.getAll(),
            getAllProduct: devConstants.urls.products.getAll()
        };

        this.isLoading = false;
        this.invoiceType = invoiceType;
        this.pageTitle = '';
        this.$scope = $scope;
        this.promise = promise;
        this.$state = $state;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.createPersonService = createPersonService;
        this.productCreateService = productCreateService;
        this.saleApi = saleApi;
        this.purchaseApi = purchaseApi;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.createPaymentService = createPaymentService;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.isPrintig = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: [],
            detailAccountId: '',
            sumPaidAmount: null,
            sumRemainder: null,
            sumTotalPrice: null,
        };

        this.isPayment = false;

        this.id = this.$state.params.id;


        if (this.id != undefined) {
            this.getPayments();
            this.editMode = true;
            if (this.invoiceType == 'sales') {
                this.pageTitle = this.translate('Edit sale')
                this.personType = this.translate('Customer');
            }
            if (this.invoiceType == 'purchases') {
                this.pageTitle = this.translate('Edit purchase')
                this.personType = this.translate('Vendor');

            }
        } else {

            if (this.invoiceType == 'sales') {
                this.pageTitle = this.translate('Create sale')
            }
            if (this.invoiceType == 'purchases') {
                this.pageTitle = this.translate('New purchase')
            }
            this.invoice = {
                number: null,
                date: localStorage.getItem('today'),
                description: '',
                invoiceLines: [],
                status: 'confirm',
                detailAccountId: ''
            };

            if (this.invoiceType == 'sales') {
                this.saleApi.getMaxNumber().then(result => {
                    if (result == null)
                        result = 0;
                    this.invoice.number = result + 1;
                });
            }

            if (this.invoiceType == 'purchases') {
                this.purchaseApi.getMaxNumber().then(result => {
                    if (result == null)
                        result = 0;
                    this.invoice.number = result + 1;
                });
            }

            this.createInvoiceLine();
        }


        if (this.editMode)
            this.fetchInvoice();
    }

    fetchInvoice() {
        let api;

        if (this.invoiceType == 'sales')
            api = this.saleApi
        else
            api = this.purchaseApi;

        this.isLoading = true;

        api.getById(this.id)
            .then(result => {
                this.invoice = result;
                if (result.status == 'waitForPayment') {
                    this.isPayment = true;
                    this.invoice.totalPrice = result.invoiceLines
                        .asEnumerable()
                        .sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat);
                    this.$state.go('^.view', {id: this.invoice.id})
                }
            })
            .finally(() => this.isLoading = false);
    }

    getPayments() {

        if (this.invoiceType == 'sales') {
            this.saleApi.payments(this.id)
                .then(result => this.payments = result);
        }

        if (this.invoiceType == 'sales') {
            this.purchaseApi.payments(this.id)
                .then(result => this.payments = result);
        }

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

    onProductChanged(item, product) {
        item.productId = product.id;
        item.description = product.title;
        item.unitPrice = product.salePrice;
        item.scale = product.scaleDisplay;
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
                productId: null,
                description: '',
                quantity: 1,
                vat: 0,
                discount: 0,
                unitPrice: 0,
                totalPrice: 0,
            };

        this.invoice.invoiceLines.push(newInvoice);
    }

    newInvoice() {
        this.$state.go('^.create')
    }

    saveInvoice(form, status) {

        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice;

        invoice.customer = {
            id: invoice.detailAccountId
        };

        invoice.invoiceLines.forEach(line => line.product = {id: line.productId});

        if (status)
            invoice.status = status;

        if (status == undefined) {
            invoice.status = 'confirm';
        }


        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        errors.asEnumerable().removeAll();

        this.isSaving = true;
        this.isPrintig = true;
        if (this.editMode == true) {
            if (this.invoiceType == 'sales') {
                return this.saleApi.update(invoice.id, invoice)
                    .then(result => {
                        logger.success();
                        this.saleApi.getById(invoice.id).then(result => {
                            if (result.status == 'waitForPayment') {
                                this.isPayment = true;
                                this.$state.go('^.view', {id: invoice.id})
                            }
                        })
                    })
                    .catch(err => errors = err)
                    .finally(() => this.isSaving = false);
            }

            if (this.invoiceType == 'purchases') {
                return this.purchaseApi.update(invoice.id, invoice)
                    .then(result => {
                        logger.success();
                        //this.isLoading = true;
                        this.purchaseApi.getById(invoice.id).then(result => {
                            if (result.status == 'waitForPayment') {
                                this.isPayment = true;
                                this.$state.go('^.view', {id: invoice.id})
                            }
                        })
                    })
                    .catch(err => errors = err)
                    .finally(() => this.isSaving = false);
            }
        } else {

            if (this.invoiceType == 'sales') {
                return this.saleApi.create(invoice)
                    .then(result => {
                        logger.success();
                        invoice.id = result.id;
                        //this.isLoading = true;
                        //this.isSaving = true;
                        this.saleApi.getById(invoice.id).then(result => {
                            this.$state.go('^.edit', {
                                id: invoice.id
                            })
                        })
                    })
                    .catch(err => errors = err)
                    .finally(() => this.isSaving = false);
            }
            if (this.invoiceType == 'purchases') {
                return this.purchaseApi.create(invoice)
                    .then(result => {
                        logger.success();
                        invoice.id = result.id;
                        //this.isLoading = true;
                        //this.isSaving = true;
                        this.purchaseApi.getById(invoice.id).then(result => {
                            this.$state.go('^.edit', {
                                id: invoice.id
                            })
                        })
                    })
                    .catch(err => errors = err)
                    .finally(() => this.isSaving = false);
            }
        }
    }

    cashPaymentShow() {

        if (this.invoice.sumRemainder == null)
            this.invoice.sumRemainder = this.invoice.sumTotalPrice;

        this.createPaymentService.show({
            amount: this.invoice.sumRemainder,
            receiveOrPay: 'receive'
        }).then(result => {

            if (this.invoiceType == 'sales') {
                return this.saleApi.pay(this.invoice.id, result)
                    .then(() => {
                        this.logger.success();
                        this.getPayments();
                        this.fetchInvoice();
                    })
                    .catch(err => this.errors = err)
                    .finally();
            }

            if (this.invoiceType == 'purchases') {
                return this.purchaseApi.pay(this.invoice.id, result)
                    .then(() => {
                        this.logger.success();
                        this.getPayments();
                        this.fetchInvoice();
                    })
                    .catch(err => this.errors = err)
                    .finally();
            }
        });
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
        item.vat = ((item.unitPrice * item.quantity) - item.discount) * 9 / 100;
    }
}
