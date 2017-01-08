import accModule from '../acc.module';

function content() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-template.html',
        transclude: true,
        scope: {},
        link: function (scope, element, attrs) {
            scope.title = attrs.title;
            scope.panelType = attrs.panelType || 'primary';
        }
    };
}

accModule.directive('devTagContent', content);