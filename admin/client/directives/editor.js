"use strict";

export default function Editor(){

    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {

            let ck = CKEDITOR.replace(elm[0]);

            if (!ngModel) return;

            ck.on('instanceReady', function() {
                ck.setData(ngModel.$viewValue);
            });

            function updateModel() {
                scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
            };

        }
    };

}