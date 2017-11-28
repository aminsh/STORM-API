
function radio() {

    return {
        transclude: true,
        restrict: 'E',
        require: 'ngModel',
        replace: true,
        template: `<div class="iradio_square-green" style="position: relative;"><span ng-transclude></span></div>`,
        link: (scope, element, attrs, ngModel) => {
            let $element = $(element),
                iradio = $element.find('.iradio_square-green');

            $element.attr('k-value', attrs.kValue);

            $element.click(function () {
                let value = $element.attr('k-value');
                scope.$apply(() => ngModel.$setViewValue(value));
            });


            /*$element.find('input').val(attrs.devAttrValue);
             $element.find('input').attr('ng-model', attrs.ngModel);

             $element.iCheck({
             checkboxClass: 'icheckbox_square-green',
             radioClass: 'iradio_square-green'
             });

             $element.on('ifChanged', e => {
             ngModel.$setViewValue(e.target.value);
             scope.$apply();
             });

             ngModel.$render = function () {
             if (ngModel.$viewValue) {
             $element.find('.iradio_square-green').addClass("checked");
             } else {
             $element.find('.iradio_square-green').removeClass("checked");
             }
             };*/

            /*scope.$watch(attrs.ngModel, newValue => {
             if(newValue)
             $element.find('.icheckbox_square-green').addClass('checked');
             else
             $element.find('.icheckbox_square-green').removeClass('checked');
             });*/

            /*return $timeout(function() {
             var value;
             value = $attrs['value'];

             $scope.$watch($attrs['ngModel'], newValue =>{
             $(element).iCheck('update');
             });

             $(element).iCheck({
             checkboxClass: 'icheckbox_square-green',
             radioClass: 'iradio_square-green'

             }).on('ifChanged', function(e) {
             if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
             $scope.$apply(function() {
             return ngModel.$setViewValue(e.target.checked);
             });
             }
             if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
             return $scope.$apply(function() {
             return ngModel.$setViewValue(value);
             });
             }
             });
             });*/
        }
    };
}

export default radio;