import accModule from '../acc.module';

function datepicker() {
    return {
        restrict: 'E',
        template: '<input kendo-date-picker style="width: 100%;" />',
        replace: true,
        link: function (scope, element, attrs) {

        }
    };
}

accModule.directive('devTagDatepicker', datepicker);