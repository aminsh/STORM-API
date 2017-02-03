"use strict";

export default function shell($rootScope, menuItems, translate, currentService, $cookies, devConstants, fiscalPeriodApi) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        scope: {},
        link: function (scope, element, attrs) {

            scope.current = {
                period: '',
                mode: devConstants.enums.AccMode().getDisplay(currentService.get().mode),
                branch: currentService.get().branch
            };

            fiscalPeriodApi.current()
                .then(result => scope.current.period = result.display);

            scope.isToggleMenuOpen = false;
            scope.menuItems = menuItems;

            $rootScope.blockUi = {
                isBlocking: false,
                message: translate('Please wait ...'),
                block: (message)=> {
                    $rootScope.blockUi.message = message
                        ? message
                        : translate('Please wait ...');

                    $rootScope.blockUi.isBlocking = true;
                },
                unBlock: ()=> {
                    $rootScope.blockUi.isBlocking = false;
                }
            };

            scope.toggle = function () {
                if (scope.isToggleMenuOpen)
                    scope.isToggleMenuOpen = false;
                else
                    scope.isToggleMenuOpen = true;
            };
        }
    };
}