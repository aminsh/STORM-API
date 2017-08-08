"use strict";

export default function guide() {
    return {
        restrict: 'E',
        template: `<div class="alert alert-info animated shake">
<button type="button" class="close">
  <span aria-hidden="true">×</span>
  <span class="sr-only">Close</span>
</button>
<div ng-transclude></div>

</div>`,
        transclude: true,
        replace: true,
        link(scope, element){
            let $wrapper = $(element);

            $wrapper.children('.close').click(() => {
                $wrapper.hide();
            })
        }
    };
}
