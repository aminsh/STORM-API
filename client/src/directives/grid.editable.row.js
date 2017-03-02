
export default function () {
    return{
        restrict: 'A',
        transclude: true,
        replace: true,
        templateUrl: 'partials/templates/grid-editable-row-template.html',
        scope: {
            columns: '=devAttrColumns',
            item: '=devAttrItem',
            changeValue: '&devAttrChangeValue'
        },
        link:(scope, element, attrs)=> {

        }
    }
}

