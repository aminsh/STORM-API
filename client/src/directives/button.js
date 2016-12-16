export default function devTagButton() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/button-template.html',
        replace: true,
        scope: {
            isWaiting: '=',
            icon: '@',
            styleType: '@',
            title: '@'
        },
        link: function (scope, element, attrs) {

        }
    };
}
