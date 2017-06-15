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
                    field: "description", title: translate('Description'), width: '120px',
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
                                        .catch((errors) => $scope.errors = errors)
                                        .finally(() => $scope.isSaving = false);
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
