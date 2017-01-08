"use strict";

export default function shell($rootScope, menuItems, translate, currentService, $cookies, constants, fiscalPeriodApi) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        scope: {},
        link: function (scope, element, attrs) {

            currentService.setFiscalPeriod(parseInt($cookies.get('current-period')));
            currentService.setMode($cookies.get('current-mode'));

            scope.current = {
                period: '',
                mode: constants.enums.AccMode().getDisplay(currentService.get().mode)
            };

            fiscalPeriodApi.current()
                .then(result=> scope.current.period = result.display);

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
                if ($scope.isToggleMenuOpen)
                    $scope.isToggleMenuOpen = false;
                else
                    $scope.isToggleMenuOpen = true;
            }

            scope.$on('fiscal-period-changed', (e, fiscalPeriod)=> {
                $cookies.put('current-period', fiscalPeriod.id);
                currentService.setFiscalPeriod(fiscalPeriod.id);

                scope.current.period = fiscalPeriod.display;
            });

            scope.$on('mode-changed', (e, mode)=> {
                $cookies.put('current-mode', mode.key);
                currentService.setMode(mode.key);
                scope.current.mode = mode.display;
            });
        }
    };
}