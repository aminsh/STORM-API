
export function content() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-template.html',
        transclude: true,
        replace: true,
        scope: false,
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

export function heading () {
    return {
        restrict: 'E',
        template: `<div class="ibox-title panel-primary" ng-transclude></div>`,
        transclude: true,
        replace: true
    };
}

export function footer () {
    return {
        restrict: 'E',
        template: `<div class="ibox-footer" ng-transclude></div>`,
        transclude: true,
        replace: true
    };
}

export function body ($parse) {
    return {
        restrict: 'E',
        template: `<div class="ibox-content" ng-transclude></div>`,
        transclude: true,
        replace: true,
        link(scope, element, attrs){
            const waitingTags = `<div class="sk-spinner sk-spinner-wave">
                                <div class="sk-rect1"></div>
                                <div class="sk-rect2"></div>
                                <div class="sk-rect3"></div>
                                <div class="sk-rect4"></div>
                                <div class="sk-rect5"></div>
                            </div>`;

            $(element).append(waitingTags);

            scope.$watch(attrs.isLoading, newValue => {
                if(newValue)
                    $(element).addClass('sk-loading');
                else
                    $(element).removeClass('sk-loading');
            });
        }
    };
}
