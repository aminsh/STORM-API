import accModule from '../acc.module';

function textEditor() {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<textarea class="form-control"></textarea>'
    };
}

function textBox() {
    return {
        require: 'ngModel',
        restrict: 'E',
        replace: true,
        template: '<input type="text" class="form-control"/>'
    };
}

accModule
    .directive('devTagEditor', textEditor)
    .directive('devTagTextBox', textBox);