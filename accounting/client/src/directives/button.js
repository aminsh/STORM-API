
export default function button() {
    return {
        restrict: 'E',
        template: `<a class="btn btn-{{styleType}}"
   ladda="isWaiting"
   data-style="expand-left">
    <i class="{{icon}}"></i>
    {{title}}
</a>`,
        replace: true,
        scope: {
            isWaiting: '=',
            icon: '@',
            styleType: '@',
            title: '@'
        },
        link: function (scope, element, attrs) {

        }
    };
}
