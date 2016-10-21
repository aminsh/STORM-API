import accModule from '../acc.module';

function accountReviewController($scope, navigate, dimensionCategoryApi, constants, formService) {

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
                url: constants.urls.detailAccount.all()
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
            $scope.dimensionCategories = cats.asEnumerable().take(3).toArray();

            $scope.dimension1DataSource = dimensionDataSourceFactory(cats[0].id);
            $scope.dimension2DataSource = dimensionDataSourceFactory(cats[1].id);
            $scope.dimension3DataSource = dimensionDataSourceFactory(cats[2].id);
            $scope.dimension4DataSource = dimensionDataSourceFactory(cats[3].id);
        });

    function dimensionDataSourceFactory(categoryId) {
        return {
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
        };
    }

    function saveState() {
        let state = JSON.stringify($scope.parameters);

        localStorage.setItem('account-review-state', state);
    }

    function getParameters(action) {
        let params = angular.extend({}, $scope.parameters);
        if (!params.minDate) delete params.minDate;
        if (!params.maxDate) delete params.maxDate;
        if (!params.minNumber) delete params.minNumber;
        if (!params.maxNumber) delete params.maxNumber;

        action.apply(params);

        return params;
    }

    $scope.executeTurnover = (reportName)=> {
        saveState();
        let params = getParameters(()=> {
            delete this.detailAccount;
            delete this.dimension1;
            delete this.dimension2;
            delete this.dimension3;
        });

        navigate('accountReviewTurnover', {name: reportName}, params);
    };

    $scope.detailAccountExecuteTurnovers = (reportName)=> {
        saveState();

        let params = getParameters(()=> {
            delete this.dimension1;
            delete this.dimension2;
            delete this.dimension3;
        });

        navigate('accountReviewTurnover', {name: reportName}, params);
    };

    $scope.dimensionExecuteTurnovers = (dimensionName, reportName)=> {
        saveState();

        let params = getParameters(()=> {
            let self = this;
            delete self.detailAccount;

            ['dimension1', 'dimension2', 'dimension3']
                .asEnumerable().where(d=> d != dimensionName)
                .toArray()
                .forEach(d=> delete self[d]);
        });

        navigate('accountReviewTurnover', {name: reportName}, params);
    };
}

accModule.controller('accountReviewController', accountReviewController);
