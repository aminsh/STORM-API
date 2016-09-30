import accModule from '../acc.module';

function shellController($scope, menuItems, translate, $rootScope) {
    "use strict";

    $scope.isToggleMenuOpen = false;
    $scope.menuItems = menuItems;

    $rootScope.blockUi = {
        isBlocking: false,
        message: translate('Please wait ...'),
        block: (message)=> {
            $rootScope.blockUi.message = message
                ? message
                : translate('Please wait ...');

            $rootScope.blockUi.isBlocking = true;
        },
        unBlock: ()=> {
            $rootScope.blockUi.isBlocking = false;
        }
    }

    $scope.toggle = function () {
        if ($scope.isToggleMenuOpen)
            $scope.isToggleMenuOpen = false;
        else
            $scope.isToggleMenuOpen = true;
    }
}

accModule
    .controller('shellController', shellController);