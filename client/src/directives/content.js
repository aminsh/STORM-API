export default function devTagContent() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-template.html',
        transclude: true,
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {
            scope.title = attrs.title;
            scope.width = attrs.width;
        }
    };
}