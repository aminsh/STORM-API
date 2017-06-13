import Guid from "guid";

export default class SalesInvoiceController {
    constructor(navigate,
                salesInvoiceApi,
                inventoryApi,
                translate,
                peopleApi,
                devConstants,
                logger,
                formService,
                $state,
                $timeout,
                $scope,
                promise,
                createPaymentService,
                createPersonService,
                productCreateService) {

        this.$scope = $scope;
        this.promise = promise;
        this.$state = $state;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.createPersonService = createPersonService;
        this.productCreateService = productCreateService;
        this.inventoryApi = inventoryApi;
        this.salesInvoiceApi = salesInvoiceApi;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.createPaymentService=createPaymentService;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: [],
            detailAccountId: null,
            status:'confirm',
            totalPrice: null,
            detailAccountId: null,
            referenceId: null
        };

        this.items = [];

        this.isLoading = false;

        this.isPayment = false;

        this.id = this.$state.params.id;

        if (this.id != undefined)
            this.editMode = true;

        if (this.editMode) {
            this.salesInvoiceApi.getById(this.id)
                .then(result => this.invoice = result);
        }
        else
            this.newInvoice();

        this.detailAccount = new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.people.getAll(),
                    dataType: "json"
                },
            },
            schema: {
                data: 'data',
                total: 'total'
            }
        });

        this.products = new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.products.getAll(),
                    dataType: "json"
                },
            },
            schema: {
                data: function (data) {
                    return data.data;
                },
                total: function (data) {
                    return data.total;
                }
            }
        });

        if (this.editMode) {
            this.salesInvoiceApi.getById(this.id)
                .then(result => {
                        this.invoice = result
                        this.invoice.totalPrice = result.invoiceLines.asEnumerable().sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat);
                        if (this.invoice.status == "waitForPayment")
                            this.isPayment = true;
                    }
                );
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
        this.$state.go('sales.create');
    }

    onSearchCustomer(item) {
        return this.promise.create((resolve, reject) => {
            let filters = [item];
            this.peopleApi.getAll({filters}).then(result => resolve(result.data));
        });
    }

    saveInvoice(form, status) {
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

        if (this.editMode == true && this.isPayment == false) {
            return this.salesInvoiceApi.update(invoice.id, invoice)
                .then(result => {
                    logger.success();
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        } else {

            return this.salesInvoiceApi.create(invoice)
                .then(result => {
                    logger.success();
                    invoice.id = result.id;
                    this.salesInvoiceApi.getById(invoice.id).then(result=>{
                       if(result.status=="waitForPayment"){
                           this.isPayment = true;
                       }else {
                           this.isPayment = false;
                       }
                    });
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        }
    }

    cashPaymentShow() {
        this.createPaymentService.show({amount: this.invoice.totalPrice}).then(result => {
            return this.salesInvoiceApi.pay(this.invoice.id, result)
                .then(result => {
                    this.logger.success();
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
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
