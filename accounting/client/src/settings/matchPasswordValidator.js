"use strict";

export let directiveId = 'ngMatch';

export function matchPasswordValidator($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            let firstPassword = $parse(attrs[directiveId]);

            let validator = function (value) {
                let temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function () {
                validator(ctrl.$viewValue);
            });

            scope.$watch(attrs[directiveId], () => {
                validator(ctrl.$viewValue);
            });

        }
    }
}