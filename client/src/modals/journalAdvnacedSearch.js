import accModule from '../acc.module';
import Collection from 'dev.collection';

function journalAdvancedSearchModalController($scope, $modalInstance, translate, devConstants,
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

    $scope.execute = () => {
        let result = {
            resolve: resolveFilter,
            data: $scope.journalSearch
        };

        $modalInstance.close(result);
    };

    $scope.close = () => $modalInstance.dismiss();

    $scope.generalLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.generalLedgerAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.subsidiaryLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.subsidiaryLedgerAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.dimension1DataSource = {};
    $scope.dimension2DataSource = {};
    $scope.dimension3DataSource = {};

    $scope.detailAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.detailAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    dimensionCategoryApi.getAll()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats;

            $scope.dimension1DataSource = dimensionOptionFactory(cats[0].id);
            $scope.dimension2DataSource = dimensionOptionFactory(cats[1].id);
            $scope.dimension3DataSource = dimensionOptionFactory(cats[2].id);
        });

    function dimensionOptionFactory(categoryId) {
        return {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.dimension.allByCategory(categoryId)
                }
            },
            schema: {
                data: 'data'
            }
        };
    }

    $scope.chequeDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.cheque.allUseds()
            }
        },
        schema: {
            data: 'data'
        }
    };

    function resolveFilter(filterData) {

        let instance = angular.extend({}, filterData);

        instance.generalLedgerAccounts = new Collection(filterData.generalLedgerAccounts)
            .asEnumerable()
            .select((g) => g.id)
            .toArray();

        instance.subsidiaryLedgerAccounts = new Collection(filterData.subsidiaryLedgerAccounts)
            .asEnumerable()
            .select((s) => s.id)
            .toArray();

        instance.detailAccounts = new Collection(filterData.detailAccounts)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension1s = new Collection(filterData.dimension2s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension2s = new Collection(filterData.dimension2s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension3s = new Collection(filterData.dimension3s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension4s = new Collection(filterData.dimension4s)
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.chequeNumbers = new Collection(filterData.chequeNumbers)
            .asEnumerable()
            .select((c) => c.id)
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

