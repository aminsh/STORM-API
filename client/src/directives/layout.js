import $ from 'jquery';
import accModule from '../acc.module';

function header($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/header-template.html',
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {
            scope.currentUser = localStorage.getItem('currentUser');
            scope.current = {
                period: '',
                mode: ''
            };

            $rootScope.$on('currentPeriodChanged', (e, currentPeriodDisplay)=> {
                scope.current.period = currentPeriodDisplay;
            });

            $rootScope.$on('currentModeChanged', (e, currentMode)=> {
                scope.current.mode = currentMode;
            });

            $(element).find('.dropdown')
            $('input').click(function () {
                $('.dropdown').addClass('open');
                $('.dropdown').addClass('test-class');
            });
        }
    }
}

function togglemenu() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/togglemenu-template.html',
        replace: true,
        scope: {
            menuitems: '=',
            toggleobservable: '='
        },
        transclude: true,
        link: function (scope, element, attrs) {
            $("#menu-toggle").click(function (e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

            createMenu(scope.menuitems, element);
        }
    }
}

function createMenu(menuItems, element) {
    menuItems.forEach(function (item) {
        var $el = $(element).find('.gw-nav');
        var icon = item.icon || 'file';

        var li = $('<li class="init-arrow-down"></li>');
        li.append('<a href="{0}"></a>'.format(item.url));
        li.find('a').append('<span class="webfont-menu" aria-hidden="true">' +
            '<span class="glyphicon glyphicon-{0}"></span>'.format(icon) +
            '</span>'.format(icon));

        li.find('a').append('<span class="gw=menu-text">{0}</span>'.format(item.title));

        if (item.children.length > 0) {
            li.find('a').append('<b class="gw-arrow icon-arrow-up8"></b>');
            li.append('<ul class="gw-submenu"></ul>');

            item.children.forEach(function (child) {
                var liChild = $('<li></li>');
                var icon = child.icon || 'file';

                liChild.append('<a href="{0}"></a>'.format(child.url));
                /* liChild.find('a')
                 .append('<span class="webfont-submenu glyphicon glyphicon-{0}"></span>'
                 .format(icon));*/

                liChild.find('a').append(child.title);

                li.find('ul').append(liChild);
            });
        }
        ;

        $el.append(li);
    });

    menuCreateExpandAndActiveBehavior($(element));
}

function menuCreateExpandAndActiveBehavior($element) {
    var $ele = function (selector) {
        return $element.find(selector);
    };

    $ele('.gw-nav > li > a').click(function (e) {
        var hrefAttr = $(this).attr('href');
        if (hrefAttr == undefined || hrefAttr == null || hrefAttr == '')
            e.preventDefault();

        var gw_nav = $ele('.gw-nav');
        gw_nav.find('li').removeClass('active');
        $ele('.gw-nav > li > ul > li').removeClass('active');

        var checkElement = $(this).parent();
        var ulDom = checkElement.find('.gw-submenu')[0];

        if (ulDom == undefined) {
            checkElement.addClass('active');
            $ele('.gw-nav').find('li').find('ul:visible').slideUp();
            return;
        }
        if (ulDom.style.display != 'block') {
            gw_nav.find('li').find('ul:visible').slideUp();
            gw_nav.find('li.init-arrow-up').removeClass('init-arrow-up').addClass('arrow-down');
            gw_nav.find('li.arrow-up').removeClass('arrow-up').addClass('arrow-down');
            checkElement.removeClass('init-arrow-down');
            checkElement.removeClass('arrow-down');
            checkElement.addClass('arrow-up');
            checkElement.addClass('active');
            checkElement.find('ul').slideDown(300);
        } else {
            checkElement.removeClass('init-arrow-up');
            checkElement.removeClass('arrow-up');
            checkElement.removeClass('active');
            checkElement.addClass('arrow-down');
            checkElement.find('ul').slideUp(300);

        }
    });
    $('.gw-nav > li > ul > li > a').click(function () {
        $ele(this).parent().parent().removeClass('active');
        $ele('.gw-nav > li > ul > li').removeClass('active');
        $(this).parent().addClass('active')
    });
};

accModule
    .directive('devTagHeader', header)
    .directive('devTagTogglemenu', togglemenu);


