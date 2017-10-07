"use strict";


export default function HtmlContent($compile){

    return {
        restrict: "E",
        scope: {
            html: "=html"
        },
        replace: true,
        link: function (scope, element){
            if(!scope.html) return;
            let temp = $compile(scope.html)(scope);
            element.replaceWith(temp);
        }
    }

}