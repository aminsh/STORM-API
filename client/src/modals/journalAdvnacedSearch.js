import accModule from '../acc.module';

function journalAdvancedSearchModalController($scope, $modalInstance, translate, constants,
                                              dimensionCategoryApi) {
    $scope.journalSearch = {
        title: '',
        minNumber: null,
        maxNumber: null,
        minDate: null,
        maxDate: null,
        generalLedgerAccounts: [],
        subsidiaryLedgerAccounts: [], //combination of generalLedgerAccount and subsidiaryLedgerAccount
        detailAccounts: [],
        dimension1s: [],
        dimension2s: [],
        dimension3s: [],
        dimension4s: [],
        chequeNumbers: [],
        minChequeDate: null,
        maxChequeDate: null,
        chequeDescription: '',
        amount: {
            value: null,
            operator: null,
        },
        isNotPeriodIncluded: false
    };

    $scope.amountOperators = [
        {key: 'eq ', display: translate('Equal to')},
        {key: 'gte', display: translate("Greater than or equal to")},
        {key: 'gt ', display: translate("Greater than")},
        {key: 'lte', display: translate("Less than or equal to")},
        {key: 'lt ', display: translate("Less than")}
    ];

    $scope.execute = ()=> {
        let result = {
            resolve: resolveFilter,
            data: $scope.journalSearch
        };

        $modalInstance.close(result);
    };

    $scope.close = ()=> $modalInstance.dismiss();

    $scope.generalLedgerAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "display",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.generalLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    $scope.subsidiaryLedgerAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "account",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.subsidiaryLedgerAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    $scope.dimension1Options = {};
    $scope.dimension2Options = {};
    $scope.dimension3Options = {};
    $scope.dimension4Options = {};

    $scope.detailAccountOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "display",
        dataValueField: "id",
        valuePrimitive: false,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.detailAccount.all()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    dimensionCategoryApi.getAll()
        .then((result)=> {
            let cats = result.data;
            $scope.dimensionCategories = cats;

            $scope.dimension1Options = dimensionOptionFactory(cats[0].id);
            $scope.dimension2Options = dimensionOptionFactory(cats[1].id);
            $scope.dimension3Options = dimensionOptionFactory(cats[2].id);
        });

    function dimensionOptionFactory(categoryId) {
        return {
            placeholder: translate('Select ...'),
            dataTextField: "display",
            dataValueField: "id",
            valuePrimitive: false,
            autoBind: false,
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: constants.urls.dimension.allByCategory(categoryId)
                    }
                },
                schema: {
                    data: 'data'
                }
            }
        };
    }

    $scope.chequeOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "number",
        dataValueField: "id",
        valuePrimitive: true,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.cheque.allUseds()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    function resolveFilter(filterData) {

        let instance = angular.extend({}, filterData);

        instance.generalLedgerAccounts = filterData.generalLedgerAccounts
            .asEnumerable()
            .select((g)=> g.id)
            .toArray();

        instance.subsidiaryLedgerAccounts = filterData.subsidiaryLedgerAccounts
            .asEnumerable()
            .select((s)=> s.id)
            .toArray();

        instance.detailAccounts = filterData.detailAccounts
            .asEnumerable()
            .select((d)=> d.id)
            .toArray();

        instance.dimension1s = filterData.dimension2s
            .asEnumerable()
            .select((d)=> d.id)
            .toArray();

        instance.dimension2s = filterData.dimension2s
            .asEnumerable()
            .select((d)=> d.id)
            .toArray();

        instance.dimension3s = filterData.dimension3s
            .asEnumerable()
            .select((d)=> d.id)
            .toArray();

        instance.dimension4s = filterData.dimension4s
            .asEnumerable()
            .select((d)=> d.id)
            .toArray();

        instance.chequeNumbers = filterData.chequeNumbers
            .asEnumerable()
            .select((c)=> c.id)
            .toArray();


        return instance;
    }
}

function journalAdvancedSearchModalService(modalBase) {
    return modalBase({
        controller: journalAdvancedSearchModalController,
        templateUrl: 'partials/modals/journalAdvancedSearch.html'
    });
}

accModule
    .controller('journalAdvancedSearchModalController', journalAdvancedSearchModalController)
    .factory('journalAdvancedSearchModalService', journalAdvancedSearchModalService);

