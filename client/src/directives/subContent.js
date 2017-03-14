import accModule from '../acc.module';

function subContent() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/subContent.html',
        transclude: true,
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {
            scope.title = attrs.title;
        }
    };
}

accModule.directive('devTagSubContent', subContent);
