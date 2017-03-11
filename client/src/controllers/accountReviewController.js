import accModule from '../acc.module';
import Collection from 'dev.collection';

function accountReviewController($scope, navigate, dimensionCategoryApi, devConstants, formService) {

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
        dimension3: null
    };

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
        .then((result)=> {
            let cats = result.data;
            $scope.dimensionCategories = new Collection(cats).asEnumerable().take(3).toArray();

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

    $scope.executeTurnover = (form,reportName)=> {
        /*if(form.$invalid)
            return formService.setDirty(form);
*/
        saveState();
        let params = getParameters();

        navigate('accountReviewTurnover', {name: reportName}, params);
    };

    $scope.detailAccountExecuteTurnovers = (reportName)=> {
        saveState();

        let params = getParameters();
        params.detailAccountId = $scope.parameters.detailAccount.id;
        params.detailAccountDisplay = $scope.parameters.detailAccount.display;

        navigate('accountReviewTurnover', {name: reportName}, params);
    };

    $scope.dimensionExecuteTurnovers = (dimensionName, reportName, index)=> {
        saveState();

        let params = getParameters();
        params[`${dimensionName}Id`] = $scope.parameters[dimensionName].id;
        params[`${dimensionName}Display`] = $scope.parameters[dimensionName].display;
        params[`${dimensionName}Caption`] = $scope.dimensionCategories[index].title;

        navigate('accountReviewTurnover', {name: reportName}, params);
    };
}

accModule.controller('accountReviewController', accountReviewController);
