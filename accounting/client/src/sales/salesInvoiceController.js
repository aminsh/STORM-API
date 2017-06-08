import Guid from 'guid';

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
                $scope) {

        this.$scope = $scope;
        this.$state = $state;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.inventoryApi = inventoryApi;
        this.salesInvoiceApi = salesInvoiceApi;
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
            invoiceLines: []
        };
        this.isLoading = false;

        this.id = this.$state.params.id;

        if (this.id != undefined)
            this.editMode = true;

        if (this.editMode) {
            this.salesInvoiceApi.getById(this.id)
                .then(result => this.invoice = result);
        }


        this.detailAccount = new kendo.data.DataSource({
            serverFiltering: true,
            //serverPaging: true,
            // pageSize: 10,
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


        this.newInvoice();

    }


    removeInvoiceLine(item) {
        this.invoice.invoiceLines.asEnumerable().remove(item);
    }


    createNewProduct(product) {
        var data = {title: product};
        this.inventoryApi.create(data)
            .then((result) => {
            })
            .catch((errors) => this.errors = errors)
    }

    createNewCustomer(customer) {
        var data = {title: customer};
        this.peopleApi.create(data)
            .then((result) => {
            })
            .catch((errors) => this.errors = errors)
    }

    createInvoiceLine() {

        let maxRow = this.invoice.invoiceLines.length == 0
                ? 0
                : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
            newInvoice = {
                id: Guid.new(),
                row: ++maxRow,
                itemId: null,
                quantity: 0,
                vat: 9,
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
            date: null,
            description: '',
            invoiceLines: []
        };

        for (let i = 1; i <= 4; i++) this.createInvoiceLine();
    }

    saveInvoice(form) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice;

        invoice.invoiceLines = invoice.invoiceLines.asEnumerable()
            .where(il => il.unitPrice > 0)
            .toArray()


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
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        }
    }

    cashPaymentShow() {
        // this.cashPaymentService.show();
    }

    print() {
        let invoice = this.invoice;
        let reportParam = {"id": invoice.id}
        this.navigate(
            'report.print',
            {key: 700},
            reportParam);
    }
}
