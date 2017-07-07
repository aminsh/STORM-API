export default class peopleListController {
    constructor(translate,
                devConstants,
                navigate,
                logger,
                $timeout,
                bankApi,
                $state,
                confirm,
                $scope) {

        this.$scope = $scope;
        this.navigate=navigate;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.$state=$state;
        this.bankApi = bankApi;
        this.errors = [];
        $scope.current=this;
        $scope.gridOption = {
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                serverPaging: true,
                pageSize: 20,
                transport: {
                    read: {
                        url: devConstants.urls.bank.getAll(),
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
                    field: "title", title: translate('Title'), width: '120px',
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
                        let bank = this.dataItem($(e.currentTarget).closest("tr"));
                        confirm(
                            translate('Remove Bank'),
                            translate('Are you sure ?'))
                            .then(function () {
                                bankApi.remove(bank.id)
                                    .then(function () {
                                        logger.success();
                                        $scope.gridOption.dataSource.read();
                                    })
                                    .catch((errors) => $scope.errors = errors)
                                    .finally(() => $scope.isSaving = false);
                            })

                    }},
                    { text: translate('Edit'), click:function (e) {
                        e.preventDefault();
                        let bank = this.dataItem($(e.currentTarget).closest("tr"));
                        return navigate('.edit', {id: bank.id});
                    }},
                    { text: translate('Tiny turnover'), click:function (e) {
                        e.preventDefault();
                        let bank = this.dataItem($(e.currentTarget).closest("tr"));

                        $scope.current.$state.go('.info',{id: bank.id,title:bank.title});
                        //return navigate('.info', {id: bank.id,title:bank.title});
                    }}], title: " ", width: "180px" }
            ]
        };
    }
}
