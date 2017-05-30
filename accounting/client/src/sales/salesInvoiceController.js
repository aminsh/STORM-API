import accModule from '../acc.module';
import Guid from 'guid';
export default class SalesInvoiceController {
    constructor(navigate,
                salesInvoiceApi,
                inventoryApi,
                translate,
                detailAccountApi,
                devConstants,
                logger,
                formService,
                $timeout,
                $scope,) {

        this.$scope = $scope;
        this.logger = logger;
        this.detailAccountApi = detailAccountApi;
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
        this.detailAccount = new kendo.data.DataSource({
            serverFiltering: true,
            //serverPaging: true,
           // pageSize: 10,
            transport: {
                read: {
                    url: devConstants.urls.detailAccount.all(),
                    dataType: "json"
                },
            },
            schema: {
                data: function (data) {

                    if (data.data !== undefined) {
                        return data.data;
                    } else {
                        return data;
                    }

                },
                total: function (data) {
                    if (data.data    !== undefined) {
                        return data.total;
                    } else {
                        return data.length;
                    }
                }
            }
        });

        this.products = new kendo.data.DataSource({
            serverFiltering: true,
            //serverPaging: true,
            //pageSize: 5,
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

        this.productVirtual = {
            itemHeight: 26,
            mapValueTo: "dataItem",
            valueMapper: function (options) {
                console.log('sheihan')
                console.log (options);
                if (options.value !== "") {
                    console.log('sheihan2')
                    console.log (options);
                    inventoryApi.getById(options.value).then(result=>{
                        options.success([result]);
                    })
                }
            }
        }


        $scope.$on('on-customer-created', (e, customer) => {
            this.detailAccount.push(customer);
        });
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
        this.detailAccountApi.create(data)
            .then((result) => {
                $scope.$broadcast('on-customer-created', result)
            })
            .catch((errors) => this.errors = errors)
    }

    createInvoiceLine() {
        let $scope = this.$scope;

        let maxRow = this.invoice.invoiceLines.length == 0
                ? 0
                : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
            newInvoice = {
                id: Guid.new(),
                row: ++maxRow,
                itemId: null,
                quantity: 0,
                tax: 0,
                vat: 0,
                discount: 0,
                unitPrice: 0,
                totalPrice: 0,
            };
        this.invoice.invoiceLines.push(newInvoice);
    }

    newInvoice(){
        this.isLoading = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: []
        };
    }
    saveInvoice(form) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice
        //isSaving = this.isSaving;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        errors.asEnumerable().removeAll();
        //  isSaving = true;

        return this.salesInvoiceApi.create(invoice)
            .then(result => {
                logger.success();
                invoice.id = result.id;
                this.isLoading = true;
            })
            .catch(err => errors = err)
        // .finally(() => isSaving = false);


    }
}
