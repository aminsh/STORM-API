import 'bootstrap';
import 'metisMenu';

export default function (menuItems, $timeout, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.sidebar-template.html',
        replace: true,
        link: (scope, element, attrs) => {
            scope.items = menuItems;

            let sideMenu = $(element).find('#side-menu');

            $timeout(() => sideMenu.metisMenu());

            scope.canShowMenu = item => {
                if (!$rootScope.user.role)
                    return true;

                if ($rootScope.user.role === 'admin')
                    return true;

                return item.role === $rootScope.user.role;
            };

            if ($(document).width() <= 992) {
                $('body').addClass('body-small')
            } else {
                $('body').removeClass('body-small')
            }
            ///////////////
            SmoothlyMenu();

            $(window).bind("resize", function () {
                if ($(document).width() <= 992) {
                    $('body').addClass('body-small')
                } else {
                    $('body').removeClass('body-small')
                }
                ///////////////
                SmoothlyMenu();
            });

            scope.$on('toggle-sidebar', () => {
                let $body = $("body");
                $body.toggleClass("mini-navbar");
                SmoothlyMenu();
            });

            scope.$on('close-sidebar', () => {
                $("body").addClass("mini-navbar");
                $('.so-toggle-sidebar-btn').removeClass('so-menu-btn-active');
                SmoothlyMenu();
            });

            function SmoothlyMenu() {
                let $body = $('body');
                if (!$body.hasClass('mini-navbar') || $body.hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    sideMenu.hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            sideMenu.fadeIn(500);
                            $('.so-toggle-sidebar-btn').addClass('so-menu-btn-active');
                        }, 100);

                } else if ($('body').hasClass('fixed-sidebar')) {
                    sideMenu.hide();
                    setTimeout(
                        function () {
                            sideMenu.fadeIn(500);
                            $('.so-toggle-sidebar-btn').addClass('so-menu-btn-active');
                        }, 300);


                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    sideMenu.removeAttr('style');
                    $('.so-toggle-sidebar-btn').removeClass('so-menu-btn-active');
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
