//import 'metisMenu';

export default function (menuItems, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.sidebar-template.html',
        replace: true,
        link: (scope, element, attrs) => {
            scope.items = menuItems;

            let sideMenu = $(element).find('#side-menu');

            $timeout(()=> sideMenu.metisMenu());

            scope.$on('toggle-sidebar', () => {
                $("body").toggleClass("mini-navbar");
                SmoothlyMenu();
            });

            function SmoothlyMenu() {
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    sideMenu.hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            sideMenu.fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    sideMenu.hide();
                    setTimeout(
                        function () {
                            sideMenu.fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    sideMenu.removeAttr('style');
                }
            }
        },
        /*compile: (tElem, tAttr) => {
            return {
                pre: (scope, element, attrs) => {
                    scope.items = menuItems;
                },
                post(scope, element, attrs){
                    let ele = tElem;
                    $(element).find('#side-menu').metisMenu();
                }
            }
        }*/
    }
}
