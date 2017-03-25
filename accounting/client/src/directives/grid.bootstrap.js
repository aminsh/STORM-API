import Collection from 'dev.collection';
import Guid from 'dev.guid';
import 'dataTables';

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
            let extra = scope.option.extra || null;

            let option = scope.option;
            scope.gridId = Guid.new();


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
            scope.pageable = (option.pageable == undefined)
                ? true
                : option.pageable;

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
            scope.option.refresh = () => scope.pageOption.refresh();
            scope.option.addItem = newItem => scope.data.unshift(newItem);
            scope.option.removeItem = item => Collection.remove(scope.data, item);

            function fetch(page) {
                if (!option.readUrl) return;

                parameters = angular.extend({}, parameters, page);

                scope.isWaiting = true;

                apiPromise.get(option.readUrl, parameters)
                    .then(result => {
                        let data = result.data;

                        if (option.mapper)
                            data.forEach(scope.option.mapper);

                        if (scope.detailTemplate)
                            data.forEach(item => item.expanded = false);

                        scope.data = data;
                        scope.total = result.total;
                        scope.aggregates = result.aggregates;

                        let selector = `#${scope.gridId}`;
                        let table;

                        if ($.fn.dataTable.isDataTable(selector)) {
                            table = $(selector).DataTable();
                        }
                        else {
                            table = $(selector).DataTable({
                                responsive: true,
                                "scrollY": scope.option.gridSize || '500px',
                                paging: false,
                                searching: false,
                                ordering: false,
                                "bInfo": false
                            });
                        }

                        $timeout(() => {
                            /* var $table = $('table.scroll'),
                             $bodyCells = $table.find('tbody tr:first').children(),
                             colWidth;

                             colWidth = $bodyCells.map(function () {
                             return $(this).width();
                             }).get();

                             // Set the width of thead columns
                             $table.find('thead tr').children().each(function (i, v) {
                             $(v).width(colWidth[i]);
                             });*/

                            table = $(selector).DataTable();
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
                parameters = {filter, sort, extra};

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
                scope.columns.forEach(c => c.removeSort && c.removeSort());
            }

            function checkHasDetail() {
                let detailTemplate = $(element).find('dev-tag-grid-detail').html();
                if (!detailTemplate) return;

                scope.detailTemplate = detailTemplate;
                scope.expand = item => item.expanded = !item.expanded;

                $(element).find('dev-tag-grid-detail').remove();
            }

            checkHasDetail();

            scope.$watch('option.readUrl', () =>
            scope.pageOption.reset && scope.pageOption.reset());

            // if (scope.option.gridSize)
            //     $(element).find('tbody').css('height', scope.option.gridSize);
        }
    }
}

