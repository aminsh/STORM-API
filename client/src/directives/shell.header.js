export default function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.header-template.html',
        replace: true,
        link: (scope, element, attrs) => {
            scope.toggleSidebar = () =>  scope.$emit('toggle-sidebar');
        }
    }
}

