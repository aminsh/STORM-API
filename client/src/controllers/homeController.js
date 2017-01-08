import accModule from '../acc.module';

function homeController($scope, $rootScope, constants, currentService, navigate) {

    debugger;

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
                url: constants.urls.period.all()
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

    $scope.modesDataSource = constants.enums.AccMode().data;

    $scope.modeOnChanged = ()=> {
        $scope.$emit('mode-changed', {
            key: $scope.current.mode,
            display: constants.enums.AccMode().getDisplay($scope.current.mode)
        });
    };

}

accModule
    .controller('homeController', homeController);