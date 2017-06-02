"use strict";

export function notShouldBeZero($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            let anotherFieldFn = $parse(attrs.notShouldBeZero);

            ngModel.$parsers.unshift(validate);
            ngModel.$formatters.push(validate);

            function validate(value) {
                let anotherValue = parseInt(anotherFieldFn(scope)),
                    isValid = (anotherValue + parseInt(value)) != 0;

                ngModel.$setValidity('notShouldBeZero', isValid);

                return value;
            }

            scope.$watch(attrs.notShouldBeZero, () => validate(ngModel.$viewValue));
        }
    };
}



