export default function devTagValidationSummary(){
    "use strict";
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/validationSummary.html',
        replace: true,
        scope: {
            errors: '='
        }
    };
}