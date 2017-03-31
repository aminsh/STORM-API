import accModule from '../acc.module';

function accountReviewController($scope, navigate, dimensionCategoryApi, devConstants, formService, translate) {

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
            reportType: 'tiny',
            filterByDetailAccountOrDimension: false,
            DetailAccountOrDimension: 'detailAccount'
        };

    $scope.reportTypes = [
        {key: 'tiny', display: translate('Tiny turnover journals')},
        {key: 'generalLedgerAccount', display: translate('Total turnover general ledger account')},
        {key: 'subsidiaryLedgerAccount', display: translate('Total turnover subsidiary ledger account')},
        {key: 'detailAccount', display: translate('Total turnover detail account')},
        {key: 'dimension1', display: `${translate('Total turnover dimension')} ${translate('Dimension1')}`},
        {key: 'dimension2', display: `${translate('Total turnover dimension')} ${translate('Dimension2')}`},
        {key: 'dimension3', display: `${translate('Total turnover dimension')} ${translate('Dimension3')}`}
    ];


    $scope.detailAccountAndDimensions = [
        {key: 'detailAccount', display: translate('Detail account')},
        {key: 'dimension1', display: translate('Dimension1')},
        {key: 'dimension2', display: translate('Dimension2')},
        {key: 'dimension3', display: translate('Dimension3')}
    ];

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

    $scope.dimension1DataSource = {};
    $scope.dimension2DataSource = {};
    $scope.dimension3DataSource = {};
    $scope.dimension4DataSource = {};

    dimensionCategoryApi.getAll()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats.asEnumerable().take(3).toArray();

            $scope.dimension1DataSource = dimensionDataSourceFactory(cats[0].id);
            $scope.dimension2DataSource = dimensionDataSourceFactory(cats[1].id);
            $scope.dimension3DataSource = dimensionDataSourceFactory(cats[2].id);
        });

    function dimensionDataSourceFactory(categoryId) {
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

    $scope.executeTurnover = (form) => {
        if (form.$invalid)
            return formService.setDirty(form);

        saveState();
        let params = getParameters(),
            reportName = $scope.parameters.reportType;

        if (!params.filterByDetailAccountOrDimension)
            return navigate('accountReviewTurnover', {name: reportName}, params);

        if (params.DetailAccountOrDimension == 'detailAccount')
            return $scope.detailAccountExecuteTurnovers(reportName);

        return $scope.dimensionExecuteTurnovers(
            params.DetailAccountOrDimension,
            reportName,
            parseInt(params.DetailAccountOrDimension.replace('dimension', '')) - 1)
    };

    $scope.detailAccountExecuteTurnovers = (reportName) => {
        saveState();

        let params = getParameters();
        params.detailAccountId = $scope.parameters.detailAccount.id;
        params.detailAccountDisplay = $scope.parameters.detailAccount.display;

        navigate('accountReviewTurnover', {name: reportName}, params);
    };

    $scope.dimensionExecuteTurnovers = (dimensionName, reportName, index) => {
        saveState();

        let params = getParameters();
        params[`${dimensionName}Id`] = $scope.parameters[dimensionName].id;
        params[`${dimensionName}Display`] = $scope.parameters[dimensionName].display;
        params[`${dimensionName}Caption`] = $scope.dimensionCategories[index].title;

        navigate('accountReviewTurnover', {name: reportName}, params);
    };
}

accModule.controller('accountReviewController', accountReviewController);
