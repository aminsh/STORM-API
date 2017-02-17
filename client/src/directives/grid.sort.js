export default function () {
    return {
        template: `<i class="fa  pointer"
                        ng-class="{'fa-sort-alpha-asc': sort.dir == '' || sort.dir == 'desc',
                        'fa-sort-alpha-desc': sort.dir == 'asc'}"
                        style="font-size: 15px;"
                        ng-style="sortStyle"
                        ng-click="change()"></i>`,
        restrict: 'E',
        scope: {
            addSort: '&devAttrAddSort',
            removeSort: '&devAttrRemoveSort',
            column: '=devAttrColumn'
        },
        link: (scope, element, attrs) => {
            let field = scope.column.name;

            scope.sort = {field: '', dir: ''};

            scope.change = () => {
                let preDir = '';

                if (scope.sort.dir == '')
                    preDir = 'asc';
                else preDir = scope.sort.dir == 'asc' ? 'desc' : 'asc';


                scope.removeSort();

                scope.sort.field = field;
                scope.sort.dir = preDir;

                scope.sortStyle = {color: '#18a689'};

                scope.addSort({sort: scope.sort});
            };

            scope.column.removeSort = () => {
                scope.sort = {field: '', dir: ''};
                scope.sortStyle = {};
            };
        }
    }
}
