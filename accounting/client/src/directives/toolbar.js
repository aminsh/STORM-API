"use strict";

import accModule from '../acc.module';

function toolbar() {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/toolbar-template.html',
        replace: true,
        transclude: true,
    };
}

accModule.directive('devTagToolbar', toolbar);
