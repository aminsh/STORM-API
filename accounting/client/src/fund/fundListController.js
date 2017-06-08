export default class peopleListController {
    constructor(translate,
                devConstants,
                navigate,
                logger,
                $timeout,
                fundApi,
                confirm,
                $scope) {

        this.$scope = $scope;
        this.navigate=navigate;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.fundApi = fundApi;
        this.errors = [];
        $scope.gridOption = {
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                serverPaging: true,
                pageSize: 20,
                transport: {
                    read: {
                        url: devConstants.urls.fund.getAll(),
                        dataType: "json"
                    }
                },
                schema: {
                    data: 'data',
                    total: 'total'
                }
            }),
            toolbar: ["excel"],
            excel: {
                fileName: "export.xls",
                filterable: true
            },
            reorderable: true,
            resizable: true,
            columnMenu: true,
            groupable: true,
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
                    field: "title", title: translate('title'), width: '120px',
                    filterable: {
                        multi: true,
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains"
                        }
                    }
                },
                { command: [
                    { text: translate('Remove'), click:function (e) {
                        e.preventDefault();
                        let fund = this.dataItem($(e.currentTarget).closest("tr"));
                        confirm(
                            translate('Remove Person'),
                            translate('Are you sure ?'))
                            .then(function () {
                                fundApi.remove(fund.id)
                                    .then(function () {
                                        logger.success();
                                        $scope.gridOption.refresh();
                                    })
                                    .catch((errors) => $scope.errors = errors)
                                    .finally(() => $scope.isSaving = false);
                            })

                    }},
                    { text: translate('Edit'), click:function (e) {
                        e.preventDefault();
                        let fund = this.dataItem($(e.currentTarget).closest("tr"));
                        return navigate('.edit', {id: fund.id});
                    }}], title: " ", width: "180px" }
            ]
        };
    }
}
