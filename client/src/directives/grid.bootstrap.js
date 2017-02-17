import Collection from 'dev.collection';

export default function (apiPromise, $timeout) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/templates/grid-template.html',
        scope: {
            option: '=',
            detailOption: '=',
            onCurrentChanged: '&'
        },
        link: (scope, element, attrs) => {
            let option = scope.option;

            scope.columns = scope.option.columns;
            scope.grid = {
                sortable: (option.sortable == undefined) ? true : option.sortable,
                filterable: (option.filterable == undefined) ? true : option.filterable,
                selectable: option.selectable
            };
            scope.data = [];
            scope.total = 0;
            scope.pageOption = {};
            scope.isWaiting = false;

            let commands = scope.option.commands;

            if (commands && commands.length > 0)
                scope.columns.push({commands});

            scope.current = false;
            scope.select = current => {
                if (!option.selectable)
                    return;
                scope.current = current;
                scope.onCurrentChanged({current});
            };


            function fetch(page) {
                parameters = angular.extend({}, parameters, page);
                scope.isWaiting = true;

                apiPromise.get(option.readUrl, parameters)
                    .then(result => {
                        let data = result.data;

                        if (scope.detailTemplate)
                            data.forEach(item => item.expanded = false);

                        scope.data = data;
                        scope.total = result.total;

                        $timeout(()=> {
                            var $table = $('table.scroll'),
                                $bodyCells = $table.find('tbody tr:first').children(),
                                colWidth;

                            colWidth = $bodyCells.map(function() {
                                return $(this).width();
                            }).get();

                            // Set the width of thead columns
                            $table.find('thead tr').children().each(function(i, v) {
                                $(v).width(colWidth[i]);
                            });
                        });

                        scope.isWaiting = false;
                    });
            }

            scope.fetch = fetch;

            scope.addFilter = addFilter;
            scope.removeFilter = removeFilter;
            scope.addSort = addSort;
            scope.removeSort = removeSort;

            let filter = {logic: 'and', filters: []},
                sort = [],
                parameters = {filter, sort};

            function addFilter(filterParam) {
                let filters = filter.filters;

                let sameFieldFilters = new Collection(filters).asEnumerable()
                    .where(f => f.field == filterParam.field)
                    .toArray();

                sameFieldFilters.forEach(f => Collection.remove(filters, f));

                filters.push(filterParam);

                scope.pageOption.reset();
            }

            function removeFilter(field) {
                let filters = filter.filters;

                let sameFieldFilters = new Collection(filters).asEnumerable()
                    .where(f => f.field == field)
                    .toArray();

                sameFieldFilters.forEach(f => Collection.remove(filters, f));

                scope.pageOption.reset();
            }

            function addSort(sortParam) {
                sort.push(sortParam);
                scope.pageOption.reset();
            }

            function removeSort() {
                Collection.removeAll(sort);
                scope.columns.forEach(c=> c.removeSort && c.removeSort());
            }

            function checkHasDetail() {
                let detailTemplate = $(element).find('dev-tag-grid-detail').html();
                if (!detailTemplate) return;

                scope.detailTemplate = detailTemplate;
                scope.expand = item => item.expanded = !item.expanded
            }

            checkHasDetail();

        }
    }
}
/*
 import accModule from '../acc.module';

 accModule.directive('devTagGridFilter', function() {
 return {
 template: `<span dropdown auto-close="outsideClick">
 <i class="fa fa-filter pointer" style="font-size: 12px;" dropdown-toggle></i>
 <ul class="dropdown-menu"
 dropdown-menu role="menu"
 aria-labelledby="btn-append-to-body"
 style="padding: 10px">
 <li>
 <input type="text" class="form-control"/>
 </li>
 <li class="divider"></li>

 <li role="menuitem">
 <dev-tag-check-box ng-model="x">ترازنامه ای</dev-tag-check-box>
 </li>
 <li role="menuitem">
 <dev-tag-check-box ng-model="x">سود و زیانی</dev-tag-check-box>
 </li>
 <li role="menuitem">
 <dev-tag-check-box ng-model="x">انتظامی</dev-tag-check-box>
 </li>
 <li class="divider"></li>
 <li role="menuitem" style="text-align: center">
 <button class="btn btn-primary btn-rounded" style="display: inline; color: white">
 <i class="fa fa-check"></i>
 </button>

 <button class="btn btn-danger    btn-rounded btn-outline" style="display: inline">
 <i class="fa fa-times"></i>
 </button>
 </li>
 </ul>
 </span>`,
 restrict: 'E',
 scope:{
 fetch: '&devAttrFetch',
 column: '=devAttrColumn'
 },
 link: (scope, element, attrs) => {

 }
 }
 });*/
