import accModule from '../acc.module';

function alertTag() {
    let alertType = {
        warning: {icon: 'warning-sign'},
        success: {icon: 'ok-sign'},
        danger: {icon: 'remove-sign'},
        info: {icon: 'info=sign'}
    }
    return {
        restrict: 'E',
        template: '<div class="alert alert-{{type}}" role="alert" style="margin-top: 10px"' +
        'ng-if="show">' +
        '<span class="glyphicon glyphicon-{{icon}}"></span>' +
        '<label>{{text}}</label>' +
        '</div>',
        scope: {
            show: '='
        },
        link: function (scope, element, attrs) {
            scope.text = attrs.text;
            scope.type = attrs.type;
            scope.icon = alertType[scope.type].icon;
        }
    };
}

accModule.directive('devTagAlert', alertTag);
