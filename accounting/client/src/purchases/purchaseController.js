import Guid from 'guid';

export default class purchaseController {
    constructor(navigate,
                purchaseApi,
                inventoryApi,
                translate,
                peopleApi,
                devConstants,
                logger,
                formService,
                $timeout,
                $state,
                $scope) {

        this.$scope = $scope;
        this.logger = logger;
        this.peopleApi = peopleApi;
        this.inventoryApi = inventoryApi;
        this.purchaseApi = purchaseApi;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;
        this.$state=$state;
        this.errors = [];
        this.isSaving = false;
        this.invoice = {
            number: null,
            detailAccountId:null,
            date: null,
            description: '',
            invoiceLines: []
        };
        this.isLoading = false;

        this.id = this.$state.params.id;

        if(this.id!=undefined)
            $scope.editMode=true;

        if($scope.editMode){
            this.purchaseApi.getById(this.id)
                .then(result => this.invoice= result);
        }

        let scope=this;

        $scope.detailAccountOptions={
            dataSource:new kendo.data.DataSource({
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
            }),
            placeholder:translate('Select ...'),
            filter: "contains",
            dataTextField: "display",
            dataValueField: "id",
            suggest:"true",
            minLength:"0",
            change:e=>{
                let dataItem =e.sender.dataItem();
                if(dataItem==undefined)
                    scope.invoice.detailAccountId=null;
                scope.invoice.detailAccountId=dataItem.id
                console.log(scope.invoice.detailAccountId)
                console.log(e)
            },
            noDataTemplate:e=>{
                $scope.newDetailAccountValue=e;
                return " <div> ردیفی با این مشخصات یافت نشد . آیا مایل به اضافه کردن آن هستید ؟ </div> <br /> <button class='k-button' ng-click='model.createNewCustomer(newDetailAccountValue)'>بله</button>"
            }
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
        let dataSource = customer.instance.dataSource;

        let data = {title: customer.instance.input.val()};

        this.peopleApi.create(data)
            .then((result) => {
                dataSource.add({
                    display: customer.instance.input.val()
                });
                dataSource.sync();
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

    newInvoice(){
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

        // if($scope.editMode==true){
        //     return this.purchaseApi.update(invoice.id,invoice)
        //         .then(result => {
        //             logger.success();
        //             this.isLoading = true;
        //         })
        //         .catch(err => errors = err)
        //         .finally(() => this.isSaving = true);
        //
        // }else{
            return this.purchaseApi.create(invoice)
                .then(result => {
                    logger.success();
                    invoice.id = result.id;
                    this.isLoading = true;
                })
                .catch(err => errors = err)
                .finally(() => this.isSaving = true);
        // }
    }

    print(){
        let invoice = this.invoice;
        let reportParam={"id": invoice.id}
        this.navigate(
            'report.print',
            {key: 701},
            reportParam);
    }

}
