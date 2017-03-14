export default function registerController(userApi, formService, navigate) {
    "use strict";

    this.user = {
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    };

    this.register = (form)=> {
        if (form.$invalid)
            return formService.setDirty(form);

        userApi.register(this.user)
            .then(result=> navigate('registerSuccess',{name: this.user.name}))
            .catch(errors=> this.errors = errors);

    };
}

var directiveId = 'matchPassword';

export function matchPassword($parse) {
    "use strict";
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function (value) {
                var temp = firstPassword(scope),
                    v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function () {
                validator(ctrl.$viewValue);
            });
        }
    }
}

export function uniqueEmail(userApi) {
    "use strict";

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            var validator = function (value) {
                if (!value) return;

                userApi.isUniqueEmail(value)
                    .then(result=> ctrl.$setValidity('unique', !result.isValid))

                return value;
            };

            elem.on('blur', function () {
                validator(ctrl.$viewValue);
            });
        }
    }
}
