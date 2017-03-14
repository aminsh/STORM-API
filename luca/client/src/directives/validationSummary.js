import accModule from '../acc.module';

function validationSummary() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/validationSummary.html',
        replace: true,
        scope: {
            errors: '='
        }
    };
}

accModule.directive('devTagValidationSummary', validationSummary);
