export default function devTagTile(){
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/tile-template.html',
        transclude: true,
        replace: true
    };
}