export default function shell() {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'app/directives/shell.html',
        link: (scope, element, attrs) => {
            scope.toggleSidenav = () => scope.$broadcast('toggle-sidenav');
        }
    }
}