
export default function () {
    return{
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/templates/grid-editable-template.html',
        scope: {
            data: '=devAttrData',
            columns: '=devAttrColumns',
            defaultItem: '=devAttrDefaultItem'
        },
        link:(scope, element, attrs)=> {
            let defaultItem = angular.extend({}, scope.defaultItem);

            scope.changeValue = (item)=> {
                scope.data.push(item);
                scope.defaultItem = angular.extend({}, defaultItem);
            };
        }
    }
}
