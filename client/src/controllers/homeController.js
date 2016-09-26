import accModule from '../acc.module';

function homeController($scope, $timeout, $route, $rootScope, constants, logger, $cookies) {
    $scope.current = {
        fiscalPeriod: parseInt($cookies.get('current-period'))
    };

    $scope.fiscalPeriodDataBound = (e)=> {
        let item = e.sender.dataItem();
        $rootScope.$emit('currentPeriodChanged', item.display);
    };

    $scope.periodDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.period.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.periodOnChange = (e)=> {
        let item = e.sender.dataItem();
        $cookies.put('current-period', item.id);
        $rootScope.$emit('currentPeriodChanged', item.display);
    };
}

accModule
    .controller('homeController', homeController);