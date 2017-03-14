"use strict";

export default function shell($rootScope, menuItems, translate, currentService, $cookies, devConstants, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        //scope: true,
        link: function (scope, element, attrs) {

            let current = currentService.get();

            scope.user = current.user;
            scope.branch = current.branch;
            scope.current = current;

            scope.fiscalPeriodDataSource = {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: devConstants.urls.period.all()
                    }
                },
                schema: {
                    data: 'data'
                }
            };
            scope.modes = devConstants.enums.AccMode().data;

            scope.$watch('current.fiscalPeriod', newValue => currentService.setFiscalPeriod(newValue));
            scope.$watch('current.mode', newValue => currentService.setMode(newValue));

            $timeout(() => $rootScope.canShowStatusSection = true);

            $('.collapse-link').click(function () {
                var ibox = $(this).closest('div.ibox');
                var button = $(this).find('i');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            });

            // Close ibox function
            $('.close-link').click(function () {
                var content = $(this).closest('div.ibox');
                content.remove();
            });


            $rootScope.blockUi = {
                isBlocking: false,
                message: translate('Please wait ...'),
                block: (message) => {
                    $rootScope.blockUi.message = message
                        ? message
                        : translate('Please wait ...');

                    $rootScope.blockUi.isBlocking = true;
                },
                unBlock: () => {
                    $rootScope.blockUi.isBlocking = false;
                }
            }
        }
    };
}