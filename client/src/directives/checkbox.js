import accModule from '../acc.module';

function checkBox() {
    return {
        require: 'ngModel',
        restrict: 'E',
        templateUrl: 'partials/templates/checkbox-template.html',
        replace: true,
        scope: {
            ngModel: '=',
            title: '@'
        },
        link: function (scope, element, attrs) {
            scope.change = ()=> {
                scope.ngModel = !scope.ngModel;
            }
        }
    };
}

accModule.directive('devTagCheckBox', checkBox);