import accModule from '../acc.module';

accModule.directive('focusMe', function ($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    }, 3000);
                }
            });
            element.bind('blur', function () {
                console.log('blur')
                model.assign(scope, false);
            })
        }
    };
});
