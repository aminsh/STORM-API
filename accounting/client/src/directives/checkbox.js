import accModule from '../acc.module';

function checkBox() {

    return {
        transclude: true,
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'partials/templates/checkbox-template.html',
        link: (scope, element, attrs, ngModel) => {
            let $element = $(element),
                icheckbox = $element.find('.icheckbox_square-green'),
                isDisabled = false;

            $element.click(function () {

                if(isDisabled)
                     return;

                scope.$apply(() => {
                    if (ngModel.$viewValue) {
                        icheckbox.removeClass('checked');
                        ngModel.$setViewValue(false);
                    }
                    else {
                        icheckbox.addClass('checked');
                        ngModel.$setViewValue(true);
                    }
                });
            });

            scope.$watch(attrs.ngDisabled, newValue => {
                if (newValue) {
                    icheckbox.addClass('disabled');
                    $element.find('[ng-transclude]').css('opacity', '.3');
                    isDisabled = true;

                }
                else {
                    icheckbox.removeClass('disabled');
                    $element.find('[ng-transclude]').css('opacity', '');
                    isDisabled = false;
                }

            });


            ngModel.$render = function () {
                if (ngModel.$viewValue) {
                    icheckbox.addClass("checked");
                } else {
                    icheckbox.removeClass("checked");
                }
            };
        }
    };
}

accModule.directive('devTagCheckBox', checkBox);