"use strict";

export default function shell($rootScope, menuItems, translate, $cookies, devConstants, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        //scope: true,
        link: function (scope, element, attrs) {

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