import accModule from '../acc.module';

function homeController($scope, $timeout, $route, $rootScope, periodApi, constants) {
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

    };
}

accModule
    .controller('homeController', homeController);