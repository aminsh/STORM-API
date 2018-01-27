"use strict";

export default function ($state) {

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        link: function (scope, element, attrs) {

            scope.$state = $state;

        }
    }
}