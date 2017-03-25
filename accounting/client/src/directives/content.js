import accModule from '../acc.module';

function content() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-template.html',
        transclude: true,
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {
            let $element = $(element),
                title_template = `<div class="ibox-title panel-primary">
                                    <h5>${attrs.devAttrTitle}</h5>     
                                 </div>`,
                content = $element.children();

            if ($element.find('.ibox-title').length == 0)
                $element.prepend(title_template);

            if ($element.find('.ibox-content').length == 0){
                content = $('<div class="ibox-content"></div>').append(content);
                $element.append(content);
            }

        }
    };
}

accModule
    .directive('devTagContent', content)
    .directive('devTagContentHeading', function () {
        return {
            restrict: 'E',
            template: `<div class="ibox-title panel-primary" ng-transclude></div>`,
            transclude: true,
            replace: true
        };
    })
    .directive('devTagContentBody', function () {
        return {
            restrict: 'E',
            template: `<div class="ibox-content" ng-transclude></div>`,
            transclude: true,
            replace: true
        };
    })
    .directive('devTagContentFooter', function () {
        return {
            restrict: 'E',
            template: `<div class="ibox-footer" ng-transclude></div>`,
            transclude: true,
            replace: true
        };
    });
