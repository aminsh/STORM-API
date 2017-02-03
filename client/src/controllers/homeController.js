import accModule from '../acc.module';

function homeController($scope, $rootScope, devConstants, currentService, navigate) {

    $scope.current = currentService.get();

    if (!$scope.current.fiscalPeriod)
        return navigate('createFiscalPeriod');

    $scope.fiscalPeriodDataBound = (e)=> {
        let item = e.sender.dataItem();
        $scope.$emit('fiscal-period-changed', item);
    };

    $scope.periodDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.period.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.periodOnChange = (e)=> {
        let item = e.sender.dataItem();
        $scope.$emit('fiscal-period-changed', item);
    };

    $scope.modesDataSource = devConstants.enums.AccMode().data;

    $scope.modeOnChanged = ()=> {
        $scope.$emit('mode-changed', {
            key: $scope.current.mode,
            display: devConstants.enums.AccMode().getDisplay($scope.current.mode)
        });
    };

}

accModule
    .controller('homeController', homeController);