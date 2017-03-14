export default function (gridFilterCellType) {
    return {
        templateUrl: 'partials/templates/grid-filter-template.html',
        restrict: 'E',
        scope: {
            addFilter: '&devAttrAddFilter',
            removeFilter: '&devAttrRemoveFilter',
            column: '=devAttrColumn'
        },
        link: (scope, element, attrs) => {
            let baseTemplate = `<li class="divider"></li>
            <li role="menuitem" style="text-align: center">
                <button ng-click="executeFilter($event)" class="btn btn-primary btn-rounded btn-outline" style="display: inline;">
                    <i class="fa fa-check"></i>
                    {{'Filter'|translate}}
                </button>

                <button  ng-click="remove($event)" class="btn btn-white btn-rounded btn-outline" style="display: inline">
                    <i class="fa fa-times"></i>
                    {{'Remove filter'|translate}}
                </button>
            </li>`;

            scope.filterStyle = {};
            scope.dropdownStyle = {};
            scope.filterable = scope.column.filterable == null ? true : scope.column.filterable;

            scope.filter = {
                field: scope.column.name,
                operator: 'eq',
                value: null
            };

            scope.status = {
                isOpen: false
            };

            let cellType = gridFilterCellType[scope.column.type];
            scope.template = cellType.template + baseTemplate;
            scope.items = cellType.data;
            scope.dataSource = cellType.dataSource;
            scope.dropdownStyle = cellType.style;

            if (scope.column.type == 'string')
                scope.filter.operator = 'contains';

            scope.executeFilter = (e) => {
                e.preventDefault();
                e.stopPropagation();
                scope.status.isOpen = !scope.status.isOpen;

                scope.addFilter({filter: scope.filter});
                scope.filterStyle = {color: '#18a689'};
            };

            scope.remove = e => {
                e.preventDefault();
                e.stopPropagation();
                scope.status.isOpen = !scope.status.isOpen;

                if (!scope.filter.field) return;

                scope.filter.value = null;
                scope.removeFilter({field: scope.filter.field});
                scope.filterStyle = {};
            };
        }
    }
}
