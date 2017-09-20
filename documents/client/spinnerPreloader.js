"use strict";

export default function SpinnerPreloader(){

    return {
        restrict: "E",
        replace: true,
        scope: { size: "@size" },
        templateUrl: "partials/templates/spinnerPreloader.html",
        link: function(scope){

            if(!scope.size)
                scope.size = "medium";

        }
    }

}