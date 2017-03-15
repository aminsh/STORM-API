export default function () {
    return {
        restrict: 'E',
        template: `<li>
                <a href="/">
                    <i class="{{devIcon}}"></i>
                    <span class="nav-label">{{devTitle}}</span>
                </a>
            </li>`,
        replace: true,
        transclude: true,
        scope: {
            devHref: '@',
            devIcon: '@',
            devTitle: '@'
        },
        link: (scope, element, attrs, ctrl, transculde) => {
            debugger;
            var x = 1;
            console.log('sadfasd');
        }
    }
}

export function sidebarItemChild() {
    return {
        restrict: 'E',
        template: ``,
        replace: true,
        transclude: true,
        scope: {
            devHref: '@',
            devIcon: '@',
            devTitle: '@'
        },
        link: (scope, element, attrs, ctrl, transculde) => {
            debugger;
            var x = 1;
            console.log('sadfasd');
        }
    }
}




