
export default class invoiceListController {
    constructor(
                translate,
                confirm,
                devConstants,
                logger,
                $timeout,
                $state,
                saleApi,
                purchaseApi,
                navigate,
                $scope) {


        let regex = /^([^.]*)/;
        let strToMatch = $state.current.name;
        let invoiceType = regex.exec(strToMatch)[0];

        this.invoiceType=invoiceType;

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.saleApi=saleApi;
        this.purchaseApi=purchaseApi
        this.errors=[];
        let self=this;

        if(this.invoiceType=='sales'){
            $scope.gridOption = {
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    serverPaging: true,
                    pageSize: 20,
                    transport: {
                        read: {
                            url: devConstants.urls.sales.getAll(),
                            dataType: "json"
                        }
                    },
                    schema: {
                        data: 'data',
                        total: 'total'
                    }
                }),
                reorderable: true,
                resizable: true,
                sortable: true,
                scrollable: {
                    virtual: true
                },
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 10
                },
                columns: [
                    {
                        field: "date", title: translate('Date'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "number", title: translate('Number'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "detailAccountDisplay", title: translate('Customer'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "description", title: translate('Title'), width: '20%',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "sumTotalPrice", title: translate('Amount'), width: '120px',
                        format: '{0:#,##}',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "sumRemainder", title: translate('Remainder'), width: '120px',
                        format: '{0:#,##}',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "statusDisplay", title: translate('Status'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    { command: [
                        { text: translate('Remove'), click:function (e) {
                            e.preventDefault();
                            let sale = this.dataItem($(e.currentTarget).closest("tr"));
                            confirm(
                                translate('Remove invoice'),
                                translate('Are you sure ?'))
                                .then(function () {
                                    saleApi.remove(sale.id)
                                        .then(function () {
                                            logger.success();
                                            $scope.gridOption.dataSource.read();
                                        })
                                        .catch((errors) => {
                                            self.errors = errors
                                        })
                                        .finally(() => self.isSaving = false);
                                })

                        }},
                        { text: translate('Edit'), click:function (e) {
                            e.preventDefault();
                            let sale = this.dataItem($(e.currentTarget).closest("tr"));
                            if(sale.status='waitForPayment'){
                                $state.go('^.view',{id:sale.id})
                            }else{
                                $state.go('^.edit', {
                                    id: sale.id
                                });
                            }

                        }},
                        { text: translate('Print'), click:function (e) {
                            e.preventDefault();
                            let sale = this.dataItem($(e.currentTarget).closest("tr"));
                            let reportParam={"id": sale.id}
                            navigate(
                                'report.print',
                                {key: 700},
                                reportParam);

                        }},], title: " ", width: "180px" }
                ]
            };
        }

        if(this.invoiceType=='purchases'){
            $scope.gridOption = {
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    serverPaging: true,
                    pageSize: 20,
                    transport: {
                        read: {
                            url: devConstants.urls.purchase.getAll(),
                            dataType: "json"
                        }
                    },
                    schema: {
                        data: 'data',
                        total: 'total'
                    }
                }),
                reorderable: true,
                resizable: true,
                sortable: true,
                scrollable: {
                    virtual: true
                },
                filterable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 10
                },
                columns: [
                    {
                        field: "date", title: translate('Date'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "number", title: translate('Number'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "detailAccountDisplay", title: translate('Customer'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "description", title: translate('Title'), width: '20%',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    {
                        field: "sumTotalPrice", title: translate('Amount'), width: '120px',
                        format: '{0:#,##}',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "sumRemainder", title: translate('Remainder'), width: '120px',
                        format: '{0:#,##}',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "eq",
                                suggestionOperator: "eq"
                            }
                        }
                    },
                    {
                        field: "statusDisplay", title: translate('Status'), width: '120px',
                        filterable: {
                            extra: false,
                            cell: {
                                operator: "contains",
                                suggestionOperator: "contains"
                            }
                        }
                    },
                    { command: [
                        { text: translate('Remove'), click:function (e) {
                            e.preventDefault();
                            let purchase = this.dataItem($(e.currentTarget).closest("tr"));
                            confirm(
                                translate('Remove invoice'),
                                translate('Are you sure ?'))
                                .then(function () {
                                    purchaseApi.remove(purchase.id)
                                        .then(function () {
                                            logger.success();
                                            $scope.gridOption.dataSource.read();
                                        })
                                        .catch((errors) => {
                                            self.errors = errors
                                        })
                                        .finally(() => self.isSaving = false);
                                })

                        }},
                        { text: translate('Edit'), click:function (e) {
                            e.preventDefault();
                            let sale = this.dataItem($(e.currentTarget).closest("tr"));
                            if(sale.status='waitForPayment'){
                                $state.go('^.view',{id:sale.id})
                            }else{
                                $state.go('^.edit', {
                                    id: sale.id
                                });
                            }
                        }},
                        { text: translate('Print'), click:function (e) {
                            e.preventDefault();
                            let sale = this.dataItem($(e.currentTarget).closest("tr"));
                            let reportParam={"id": sale.id}
                            navigate(
                                'report.print',
                                {key: 700},
                                reportParam);

                        }},], title: " ", width: "180px" }
                ]
            };
        }

    }
}
