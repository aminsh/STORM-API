import accModule from '../acc.module';

function journalAdvancedSearchModalController($scope, $uibModalInstance, translate, devConstants, $q,
                                              chequeApi,
                                              dimensionApi,
                                              generalLedgerAccountApi,
                                              subsidiaryLedgerAccountApi,
                                              detailAccountApi,
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
            operator: 'eq',
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

        $uibModalInstance.close(result);
    };

    $scope.close = () => $uibModalInstance.dismiss();

    let dimensionCategories = dimensionCategoryApi.getAllLookupSync().data,
        promises = [
            {key: 'generalLedgerAccount', func: generalLedgerAccountApi.getAll()},
            {key: 'subsidiaryLedgerAccount', func: subsidiaryLedgerAccountApi.getAll()},
            {key: 'detailAccount', func: detailAccountApi.getAll()},
            {key: 'dimension1', func: dimensionApi.getByCategory(dimensionCategories[0].id)},
            {key: 'dimension2', func: dimensionApi.getByCategory(dimensionCategories[1].id)},
            {key: 'dimension3', func: dimensionApi.getByCategory(dimensionCategories[2].id)},
            {key: 'cheque', func: chequeApi.getAllUsed()}
        ];

    $q.all(
        promises.asEnumerable()
            .select(p => p.func)
            .toArray())
        .then(result => {
            $scope.generalLedgerAccountDataSource = result[0].data;
            $scope.subsidiaryLedgerAccountDataSource = result[1].data;
            $scope.detailAccountDataSource = result[2].data;
            $scope.dimension1DataSource = result[3].data;
            $scope.dimension2DataSource = result[4].data;
            $scope.dimension3DataSource = result[5].data;
            $scope.chequeDataSource = result[6];

            $scope.canShowContent = true;

        });

    $scope.generalLedgerAccountDataSource = [];
    $scope.subsidiaryLedgerAccountDataSource = [];
    $scope.dimension1DataSource = [];
    $scope.dimension2DataSource = [];
    $scope.dimension3DataSource = [];
    $scope.chequeDataSource = [];


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

    function resolveFilter(filterData) {

        let instance = angular.extend({}, filterData);

        instance.generalLedgerAccounts = filterData.generalLedgerAccounts
            .asEnumerable()
            .select((g) => g.id)
            .toArray();

        instance.subsidiaryLedgerAccounts = filterData.subsidiaryLedgerAccounts
            .asEnumerable()
            .select((s) => s.id)
            .toArray();

        instance.detailAccounts = filterData.detailAccounts
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension1s = filterData.dimension2s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension2s = filterData.dimension2s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension3s = filterData.dimension3s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.dimension4s = filterData.dimension4s
            .asEnumerable()
            .select((d) => d.id)
            .toArray();

        instance.chequeNumbers = filterData.chequeNumbers
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

