import accModule from '../acc.module';

function combobox() {
    return {
        restrict: 'E',
        replace: true,
        template: '<input kendo-combo-box />',
        link: function (scope, element, attrs) {

        }
    };
}

accModule.directive('devTagComboBox', combobox);
