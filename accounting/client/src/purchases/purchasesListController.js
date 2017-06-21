import accModule from '../acc.module';
export default class purchasesListController {
    constructor(translate,
                devConstants,
                confirm,
                logger,
                $timeout,
                purchaseApi,
                navigate,
                $state,
                $scope,) {

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.purchaseApi = purchaseApi;
        this.errors = [];

        let self = this;
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
                {
                    command: [
                        {
                            text: translate('Remove'), click: function (e) {
                            e.preventDefault();
                            let purchase = this.dataItem($(e.currentTarget).closest("tr"));
                            confirm(
                                translate('Remove invoice'),
                                translate('Are you sure ?'))
                                .then(function () {
                                    purchaseApi.remove(purchase.id)
                                        .then(function () {
                                            logger.success();
                                            $scope.gridOption.refresh();
                                        })
                                        .catch((errors) => self.errors = errors)
                                        .finally(() => self.isSaving = false);
                                })

                        }
                        },
                        {
                            text: translate('Edit'), click: function (e) {
                            e.preventDefault();
                            let purchase = this.dataItem($(e.currentTarget).closest("tr"));
                            $state.go('^.edit', {
                                id: purchase.id
                            });
                        }
                        },
                        {
                            text: translate('Print'), click: function (e) {
                            e.preventDefault();
                            let purchase = this.dataItem($(e.currentTarget).closest("tr"));
                            let reportParam = {"id": purchase.id}
                            navigate(
                                'report.print',
                                {key: 701},
                                reportParam);

                        }
                        },], title: " ", width: "180px"
                }
            ]
        };

    }
}
