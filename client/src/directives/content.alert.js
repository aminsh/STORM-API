export default function devTagContentAlert(){
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-alert-template.html',
        transclude: true,
        replace: true,
        scope: {
            alertType: '@'
        },
        link: function (scope, element, attrs) {
            scope.width = attrs.width;

            scope.icon = getIconCss(scope.alertType);

            function getIconCss(type){
                switch(type) {
                    case 'success':
                        return 'glyphicon-ok-circle';
                        break;
                    case 'warning':
                        return'glyphicon-alert';
                        break;
                    case 'danger':
                        return'glyphicon-remove-circle';
                        break;
                    case 'info':
                        return'glyphicon-info-sign';
                }
            }
        }
    };
}