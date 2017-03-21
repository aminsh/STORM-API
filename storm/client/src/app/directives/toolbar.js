class ToolbarController {
    constructor($mdSidenav, $scope, $rootScope, $window) {
        self.$mdSidenav = $mdSidenav;
        $scope.openMenu = this.openMenu;

        $scope.$on('toggle-sidenav', this.openMenu);

        let currentUser = $window.document.getElementsByName("currentUser")[0].content;

        if (currentUser) {
            $scope.currentUser = currentUser;
            $scope.currentUserImage = $window.document.getElementsByName("currentUserImage")[0].content;
            $scope.logined = true;
        } else {
            currentUser = $rootScope.currentUser;

            if (currentUser) {
                $scope.currentUser = currentUser;
                $scope.logined = true;
            }
        }
    }

    openMenu() {
        self.$mdSidenav('right').toggle();
    }
}

ToolbarController.$inject = ['$mdSidenav', '$scope', "$rootScope", "$window"];

export default function toolbar() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            class: '@classes',
        },
        link: function ($scope, el, attrs) {
            $scope.toolbar.class = $scope.class;
        },
        templateUrl: 'app/directives/toolbar.html',//require('./toolbar.html'),
        controller: ToolbarController,
        controllerAs: 'toolbar'
    }
}
