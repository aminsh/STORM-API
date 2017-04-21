function shell($mdSidenav, $rootScope, $window) {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'app/directives/shell.html',
        link: (scope, element, attrs) => {
            scope.openMenu = () => $mdSidenav('right').toggle();//scope.$broadcast('toggle-sidenav');

            let currentUser = $window.document.getElementsByName("currentUser")[0].content;

            if (currentUser) {
                scope.currentUser = currentUser;
                scope.currentUserImage = $window.document.getElementsByName("currentUserImage")[0].content;
                scope.logined = true;
            } else {
                currentUser = $rootScope.currentUser;

                if (currentUser) {
                    scope.currentUser = currentUser;
                    scope.logined = true;
                }
            }
        }
    }
}

shell.$inject = ['$mdSidenav', '$rootScope', '$window'];

export default shell;