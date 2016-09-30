import accModule from '../acc.module';

function textEditor() {
    return {
        restrict: 'E',
        replace: true,
        template: '<textarea kendo-editor k-ng-model="ngModel"></textarea>',
        link: function (scope, element, attrs) {

        }
    };
}

accModule.directive('devTagEditor', textEditor);