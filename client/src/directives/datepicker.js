import accModule from '../acc.module';

function datepicker() {
    return {
        restrict: 'E',
        template: '<adm-dtp ng-model="ngModel"></adm-dtp>',
        scope: {ngModel: '='}
    };
}

accModule.directive('devTagDatepicker', datepicker);