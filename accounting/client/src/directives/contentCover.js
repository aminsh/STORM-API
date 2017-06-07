"use strict";

export function contentCover(){
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-cover.html',
        scope: false,
        transclude: true,
        replace: true,
        link:  (scope, element, attrs) => {

        }
    };
}

export function contentCoverForm(){
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/content-cover-form.html',
        scope: false,
        transclude: true,
        replace: true,
        link:  (scope, element, attrs) => {

        }
    };
}

