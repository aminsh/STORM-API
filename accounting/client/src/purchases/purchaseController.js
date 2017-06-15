import Guid from "guid";

// export default class purchaseController {
//     constructor(navigate,
//                 purchaseApi,
//                 translate,
//                 peopleApi,
//                 devConstants,
//                 logger,
//                 formService,
//                 $timeout,
//                 $scope,
//                 $state,
//                 $stateParams,
//                 promise,
//                 createPersonService,
//                 createPaymentService,
//                 productCreateService) {
//
//         this.urls = {
//             getAllPeople: devConstants.urls.people.getAll(),
//             getAllProduct: devConstants.urls.products.getAll()
//         };
//         this.$scope = $scope;
//         this.promise = promise;
//         this.$state = $state;
//         this.logger = logger;
//         this.peopleApi = peopleApi;
//         this.createPersonService = createPersonService;
//         this.productCreateService = productCreateService;
//         this.purchaseApi = purchaseApi;
//         this.$timeout = $timeout;
//         this.logger = logger;
//         this.createPaymentService=createPaymentService;
//         this.translate = translate;
//         this.navigate = navigate;
//         this.formService = formService;
//         this.errors = [];
//         this.isSaving = false;
//         this.invoice = {
//             number: null,
//             date: null,
//             description: '',
//             invoiceLines: [],
//             detailAccountId: null,
//             referenceId: null
//         };
//         this.isLoading = false;
//
//         this.id = $stateParams.id;
//
//         if (this.id != undefined) {
//             this.editMode = true;
//         } else {
//             this.purchaseApi.getMaxNumber().then(result => {
//                 if (result == null)
//                     result = 0;
//                 this.invoice.number = result + 1;
//             });
//
//             this.createInvoiceLine();
//         }
//
//         if (this.editMode) {
//             this.purchaseApi.getById(this.id)
//                 .then(result => {
//                     this.isSaving = true
//                     this.invoice = result
//                     if (result.status == 'waitForPayment') {
//                         this.isPayment = true;
//                         this.invoice.totalPrice = result.invoiceLines.asEnumerable().sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat)
//                     }
//                 });
//         }
//         this.detailAccount = new kendo.data.DataSource({
//             serverFiltering: true,
//
//             transport: {
//                 read: {
//                     url: devConstants.urls.people.getAll(),
//                     dataType: "json"
//                 },
//             },
//             schema: {
//                 data: 'data',
//                 total: 'total'
//             }
//         });
//
//         this.products = new kendo.data.DataSource({
//             serverFiltering: true,
//             transport: {
//                 read: {
//                     url: devConstants.urls.products.getAll(),
//                     dataType: "json"
//                 },
//             },
//             schema: {
//                 data: function (data) {
//                     return data.data;
//                 },
//                 total: function (data) {
//                     return data.total;
//                 }
//             }
//         });
//
//
//         //this.newInvoice();
//     }
//
//
//     removeInvoiceLine(item) {
//         this.invoice.invoiceLines.asEnumerable().remove(item);
//     }
//
//
//     createNewProduct(item, title) {
//         return this.promise.create((resolve, reject) => {
//             this.productCreateService.show({title})
//                 .then(result => {
//                     item.productId = result.id;
//                     item.description = title;
//                     resolve({id: result.id, title});
//                 });
//         });
//     }
//
//     onProductChanged(item, product) {
//         item.description = product.title;
//     }
//
//     createNewCustomer(title) {
//         return this.promise.create((resolve, reject) => {
//             this.createPersonService.show({title})
//                 .then(result => {
//                     this.invoice.detailAccountId = result.id;
//                     resolve({id: result.id, title})
//                 });
//         });
//     }
//
//     createInvoiceLine() {
//
//         let maxRow = this.invoice.invoiceLines.length == 0
//                 ? 0
//                 : this.invoice.invoiceLines.asEnumerable().max(line => line.row),
//             newInvoice = {
//                 id: Guid.new(),
//                 row: ++maxRow,
//                 productId: null,
//                 description: '',
//                 quantity: 0,
//                 vat: 0,
//                 discount: 0,
//                 unitPrice: 0,
//                 totalPrice: 0,
//             };
//
//         this.invoice.invoiceLines.push(newInvoice);
//     }
//
//     newInvoice() {
//         this.$state.go('^.create');
//     }
//
//     saveInvoice(form, status) {
//         let logger = this.logger,
//             formService = this.formService,
//             errors = this.errors,
//             invoice = this.invoice;
//
//         if (status){
//             invoice.status = status;
//         }
//
//
//         if (status==undefined){
//             invoice.status = 'confirm';
//         }
//         if (form.$invalid) {
//             formService.setDirty(form);
//             Object.keys(form).asEnumerable()
//                 .where(key => key.includes('form-'))
//                 .toArray()
//                 .forEach(key => formService.setDirty(form[key]));
//             return;
//         }
//
//         errors.asEnumerable().removeAll();
//         if (this.editMode == true) {
//             return this.purchaseApi.update(invoice.id, invoice)
//                 .then(result => {
//                     logger.success();
//                     this.isLoading = true;
//                     this.purchaseApi.getById(invoice.id).then(result => {
//                         if (result.status == 'waitForPayment') {
//                             this.isPayment = true;
//                         }
//                     })
//                 })
//                 .catch(err => errors = err)
//                 .finally(() => this.isSaving = true);
//         } else {
//
//             return this.purchaseApi.create(invoice)
//                 .then(result => {
//                     logger.success();
//                     invoice.id = result.id;
//                     this.isLoading = true;
//                     this.purchaseApi.getById(invoice.id).then(result => {
//                         if (result.status == 'waitForPayment') {
//                             this.isPayment = true;
//                             invoice.totalPrice = invoice.invoiceLines.sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat)
//                         }
//                         if (result.status == 'draft') {
//                             this.$state.go('^.edit', {
//                                 id: invoice.id
//                             });
//                         }
//                     })
//                 })
//                 .catch(err => errors = err)
//                 .finally(() => this.isSaving = true);
//         }
//     }
//
//     cashPaymentShow() {
//         this.createPaymentService.show({amount: this.invoice.totalPrice}).then(result => {
//             return this.purchaseApi.pay(this.invoice.id, result)
//                 .then(result => {
//                     this.logger.success();
//                     this.isLoading = true;
//                 })
//                 .catch(err => this.errors = err)
//                 .finally(() => this.isSaving = true);
//         });
//     }
//
//     print() {
//         let invoice = this.invoice;
//         let reportParam = {"id": invoice.id};
//         this.navigate(
//             'report.print',
//             {key: 701},
//             reportParam);
//     }
//
//     onItemPropertyChanged(item) {
//         item.vat = ((item.unitPrice * item.quantity) - item.discount) * 9 / 100;
//     }
// }


export default class purchaseController {
    constructor(navigate,
                devConstants,
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

        this.urls = {
            getAllPeople: devConstants.urls.people.getAll(),
            getAllProduct: devConstants.urls.products.getAll()
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
        this.createPaymentService = createPaymentService;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.invoice = {
            number: null,
            date: null,
            description: '',
            invoiceLines: [],
            detailAccountId: '',
        };

        this.isLoading = false;
        this.isPayment = false;
        this.isSaving=false;

        this.id = this.$state.params.id;

        if (this.id != undefined) {
            this.editMode = true;
        } else {

            this.isLoading = false;
            this.invoice = {
                number: null,
                date: localStorage.getItem('today'),
                description: '',
                invoiceLines: [],
                status: 'confirm',
                detailAccountId: ''
            };
            this.purchaseApi.getMaxNumber().then(result => {
                if (result == null)
                    result = 0;
                this.invoice.number = result + 1;
            });

            this.createInvoiceLine();
        }


        if (this.editMode) {
            this.isSaving=true;
            this.purchaseApi.getById(this.id)
                .then(result => {
                    this.invoice = result
                    if (result.status == 'waitForPayment') {
                        this.isPayment = true;
                        this.invoice.totalPrice = result.invoiceLines
                            .asEnumerable()
                            .sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat)
                    }
                });
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
                productId: null,
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
        this.$state.go('^.create')
    }

    saveInvoice(form, status) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            invoice = this.invoice;

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

        if (this.editMode == true) {
            return this.purchaseApi.update(invoice.id, invoice)
                .then(result => {
                    logger.success();
                    this.isLoading = true;
                    this.purchaseApi.getById(invoice.id).then(result => {
                        if (result.status == 'waitForPayment') {
                            this.isPayment = true;
                        }
                    })
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        } else {

            return this.purchaseApi.create(invoice)
                .then(result => {
                    logger.success();
                    invoice.id = result.id;
                    this.isLoading = true;
                    this.isSaving = true;
                    this.purchaseApi.getById(invoice.id).then(result => {
                        if (result.status == 'waitForPayment') {
                            this.isPayment = true;
                            invoice.totalPrice = invoice.invoiceLines.asEnumerable()
                                .sum(item => (item.unitPrice * item.quantity) - item.discount + item.vat);
                        }
                        if(result.status=='draft'){
                            this.$state.go('^.edit', {
                                id: invoice.id
                            });
                        }
                    })
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        }
    }

    cashPaymentShow() {
        this.createPaymentService.show({amount: this.invoice.totalPrice}).then(result => {
            return this.purchaseApi.pay(this.invoice.id, result)
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