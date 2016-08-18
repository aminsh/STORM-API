import accModule from '../acc.module';


function customValidator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {
                if (ngModelValue == 0)
                    ctrl.$setValidity('notZero', false);
                else
                    ctrl.$setValidity('notZero', true);

                return ngModelValue;
            }

            ctrl.$parsers.push(customValidator);
        }
    }
}

accModule.directive('notZero', customValidator);