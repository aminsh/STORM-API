export default class peopleListController {
    constructor(translate,
                devConstants,
                navigate,
                logger,
                $timeout,
                peopleApi,
                confirm,
                $scope) {

        this.$scope = $scope;
        this.navigate = navigate;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.peopleApi = peopleApi;
        this.errors = [];

        $scope.$on('on-people-committed',(e,data)=>{
            console.log('hello baby')
            $scope.gridOption.dataSource.read();
        });

        $scope.gridOption = {
            dataSource: new kendo.data.DataSource({
                serverFiltering: true,
                serverPaging: true,
                pageSize: 20,
                transport: {
                    read: {
                        url: devConstants.urls.people.getAll(),
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
                    field: "title", title: translate('name'), width: '120px',
                    filterable: {
                        extra: false,
                        cell: {
                            operator: "contains",
                            suggestionOperator: "contains"
                        }
                    }
                },
                {
                    field: "phone", title: translate('Phone'), width: '120px', filterable: {
                    extra: false
                }
                },
                {
                    template: "#: personTypeDisplay #",
                    field: "personType",
                    title: translate('Person Type'),
                    width: '120px',
                    filterable: {
                        extra: false,
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: devConstants.enums.PersonType().data,
                                dataTextField: "display",
                                dataValueField: "key",
                                optionLabel: translate('Select ...')
                            });
                        }
                    }
                },
                {
                    command: [
                        {
                            text: translate('Remove'), click: function (e) {
                            e.preventDefault();
                            let people = this.dataItem($(e.currentTarget).closest("tr"));
                            confirm(
                                translate('Are you sure ?'),
                                translate('Remove Person'))
                                .then(function () {
                                    peopleApi.remove(people.id)
                                        .then(function () {
                                            logger.success();
                                            $scope.gridOption.dataSource.read();
                                        })
                                        .catch((errors) => $scope.errors = errors)
                                        .finally(() => $scope.isSaving = false);
                                })

                        }
                        },
                        {
                            text: translate('Edit'),
                            click: function (e) {
                                e.preventDefault();
                                let people = this.dataItem($(e.currentTarget).closest("tr"));
                                return navigate('.edit', {id: people.id});
                            }
                        },
                        {
                            text: translate('More Info'),
                            click: function (e) {
                                e.preventDefault();
                                let people = this.dataItem($(e.currentTarget).closest("tr"));
                                return navigate('.info', {id: people.id});
                            }
                        }

                        ], title: " ", width: "180px"
                }
            ]
        };
    }
}
