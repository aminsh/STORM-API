function shell($rootScope, $window) {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'app/layout/shell.html',
        link: (scope, element, attrs) => {

            scope.toggleSidenav = () => $mdSidenav('right').toggle();
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

            scope.logout = () => $window.href = `${$window.origin}/logout`;
        }
    }
}

shell.$inject = ['$rootScope', '$window'];

export default shell;