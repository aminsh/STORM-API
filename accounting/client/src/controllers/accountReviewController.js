import accModule from '../acc.module';

function accountReviewController($scope,
                                 navigate,
                                 detailAccountApi,
                                 dimensionCategoryApi,
                                 dimensionApi,
                                 formService,
                                 translate,
                                 $q) {

    $scope.parameters = [];
    $scope.reportTypes = [
        {key: 'tiny', display: translate('Tiny turnover journals')},
        {key: 'generalLedgerAccount', display: translate('Total turnover general ledger account')},
        {key: 'subsidiaryLedgerAccount', display: translate('Total turnover subsidiary ledger account')},
        {key: 'detailAccount', display: translate('Total turnover detail account')},
        {key: 'dimension1', display: `${translate('Total turnover dimension')} ${translate('Dimension1')}`},
        {key: 'dimension2', display: `${translate('Total turnover dimension')} ${translate('Dimension2')}`},
        {key: 'dimension3', display: `${translate('Total turnover dimension')} ${translate('Dimension3')}`}
    ];

    $scope.reportTypeFilter = item =>
    !$scope.parameters.filterByDetailAccountOrDimension ||
    ($scope.parameters.filterByDetailAccountOrDimension && item.key != $scope.parameters.detailAccountOrDimension);

    $scope.detailAccountAndDimensions = [
        {key: 'detailAccount', display: translate('Detail account')},
        {key: 'dimension1', display: translate('Dimension1')},
        {key: 'dimension2', display: translate('Dimension2')},
        {key: 'dimension3', display: translate('Dimension3')}
    ];

    $scope.detailAccountDataSource = false;
    $scope.dimensionCategories = dimensionCategoryApi.getAllLookupSync();
    $scope.dimension1DataSource = [];
    $scope.dimension2DataSource = [];
    $scope.dimension3DataSource = [];

    init();

    function saveState() {
        let state = JSON.stringify($scope.parameters);

        localStorage.setItem('account-review-state', state);
    }

    function getParameters() {
        let parameters = $scope.parameters,
            params = {};

        if (parameters.minNumber) {
            params.minNumber = parameters.minNumber;
            params.maxNumber = parameters.maxNumber;
        }

        if (parameters.minDate) {
            params.minDate = parameters.minDate;
            params.maxDate = parameters.maxDate;
        }

        params.notShowZeroRemainder = parameters.notShowZeroRemainder;
        params.isNotPeriodIncluded = parameters.isNotPeriodIncluded;

        return params;
    }

    $scope.executeTurnover = (form, reportName) => {
        if (form.$invalid)
            return formService.setDirty(form);

        saveState();

        let parameters = $scope.parameters;

        if (parameters.filterByDetailAccountOrDimension == false)
            return navigate('account-review-turnover', {name: reportName}, getParameters());

        if (parameters.detailAccountOrDimension == 'detailAccount')
            return $scope.detailAccountExecuteTurnovers(reportName);

        return $scope.dimensionExecuteTurnovers(
            parameters.detailAccountOrDimension,
            reportName,
            parseInt(parameters.detailAccountOrDimension.replace('dimension', '')) - 1)
    };

    $scope.detailAccountExecuteTurnovers = (reportName) => {
        saveState();

        let params = getParameters();
        params.detailAccountId = $scope.parameters.detailAccount.id;
        params.detailAccountDisplay = $scope.parameters.detailAccount.display;

        navigate('account-review-turnover', {name: reportName}, params);
    };

    $scope.dimensionExecuteTurnovers = (dimensionName, reportName, index) => {
        saveState();

        let params = getParameters();
        params[`${dimensionName}Id`] = $scope.parameters[dimensionName].id;
        params[`${dimensionName}Display`] = $scope.parameters[dimensionName].display;
        params[`${dimensionName}Caption`] = $scope.dimensionCategories[index].title;


        //navigate('accountReviewTurnover', {name: reportName}, params);
    };

    function init() {

        let dimensionPromise = $scope.dimensionCategories
            .asEnumerable()
            .select(c => dimensionApi.getByCategory(c.id))
            .toArray();

        $q.all([
            detailAccountApi.getAll(),
            dimensionApi,
            dimensionPromise[0],
            dimensionPromise[1],
            dimensionPromise[2]])
            .then(result => {
                $scope.detailAccountDataSource = result[0].data;
                $scope.dimension1DataSource = result[1].data;
                $scope.dimension2DataSource = result[2].data;
                $scope.dimension3DataSource = result[3].data;

                $scope.parameters = localStorage.getItem('account-review-state')
                    ? JSON.parse(localStorage.getItem('account-review-state'))
                    : {
                        minDate: '',
                        maxDate: '',
                        minNumber: null,
                        maxNumber: null,
                        notShowZeroRemainder: false,
                        isNotPeriodIncluded: false,
                        detailAccount: null,
                        dimension1: null,
                        dimension2: null,
                        dimension3: null,
                        filterByDetailAccountOrDimension: false,
                        detailAccountOrDimension: 'detailAccount'
                    };
            });
    }
}

accModule.controller('accountReviewController', accountReviewController);
