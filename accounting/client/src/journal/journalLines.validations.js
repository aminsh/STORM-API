"use strict";

export function notShouldBeZeroBoth($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            let anotherFieldFn = $parse(attrs.notShouldBeZeroBoth);

            ngModel.$parsers.unshift(validate);
            ngModel.$formatters.push(validate);

            function validate(value) {
                let anotherValue = parseInt(anotherFieldFn(scope)),
                    isValid = (anotherValue + parseInt(value)) != 0;

                ngModel.$setValidity('notShouldBeZeroBoth', isValid);

                return value;
            }

            scope.$watch(attrs.notShouldBeZeroBoth, () => validate(ngModel.$viewValue));
        }
    };
}

export function notShouldHaveValueBoth ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            let anotherFieldFn = $parse(attrs.notShouldHaveValueBoth);

            ngModel.$parsers.unshift(validate);
            ngModel.$formatters.push(validate);

            function validate(value) {
                let anotherValue = parseInt(anotherFieldFn(scope)),
                    isValid = !(parseInt(value) > 0 && anotherValue > 0);

                ngModel.$setValidity('notShouldHaveValueBoth', isValid);

                return value;
            }

            scope.$watch(attrs.notShouldHaveValueBoth, () => validate(ngModel.$viewValue));
        }
    };

}



