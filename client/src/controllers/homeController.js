import accModule from '../acc.module';

function homeController($scope, $timeout, $route, $rootScope) {
    $scope.fileUpload = {
        url: 'api/upload',
        dragdrop: true,
        drag_element: 'upload_div',
        callbacks: {
            init: ()=> {
                debugger;
            }
        }
    }
}

accModule
    .controller('homeController', homeController);