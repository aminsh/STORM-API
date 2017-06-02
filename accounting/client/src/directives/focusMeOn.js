"use strict";

export default function () {
    return {
        restrict: 'A',
        link(scope, element, attrs){
            if (angular.isDefined(attrs.focusMeOn)) {
                scope.$on(attrs.focusMeOn, () => {
                    element[0].focus();
                });
            }
        }
    }
}