import accModule from '../acc.module';

function blockUi() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/blockUi.html',
        transclude: true,
        link: function (scope, element, attrs) {

        }
    };
}

accModule.directive('devTagBlockUi', blockUi);
