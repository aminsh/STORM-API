import accModule from '../acc.module';

function numeric() {
    return {
        restrict: 'E',
        template: '<input type="number" class="form-control" /> ',
        replace: true
    }
}

accModule.directive('devTagNumeric', numeric);