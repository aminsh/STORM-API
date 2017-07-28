import Guid from 'guid';
import 'jquery-datatables';

export default function (apiPromise, $timeout) {
    return {
        restrict: 'E',
        priority: 100,
        transclude: true,
        templateUrl: 'partials/templates/grid-template.html',
        scope: {
            option: '=',
            detailOption: '=',
            onCurrentChanged: '&'
        },
        link: (scope, element, attrs) => {
            let extra = scope.option.extra || null,
                option = scope.option,
                defaultSort = option.sort || [];

            scope.gridId = Guid.new();

            scope.$on(`${option.name}/execute-advanced-search`, (e, extra)=> {
                parameters.extra=extra ;
                scope.pageOption.reset();
            });

            scope.columns = [...scope.option.columns];
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
            scope.option.removeItem = item => scope.data.remove(item);

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
                sort = [...defaultSort],
                parameters = {filter, sort, extra};

            function addFilter(filterParam) {
                let filters = filter.filters;

                let sameFieldFilters = filters.asEnumerable()
                    .where(f => f.field == filterParam.field)
                    .toArray();

                sameFieldFilters.forEach(f => filters.asEnumerable().remove(f));

                filters.push(filterParam);

                scope.pageOption.reset();
            }

            function removeFilter(field) {
                let filters = filter.filters;

                let sameFieldFilters = filters.asEnumerable()
                    .where(f => f.field == field)
                    .toArray();

                sameFieldFilters.forEach(f => filters.asEnumerable().remove(f));

                scope.pageOption.reset();
            }

            function addSort(sortParam) {
                sort.push(sortParam);
                scope.pageOption.reset();
            }

            function removeSort() {
                sort.asEnumerable().removeAll();
                scope.columns.forEach(c => c.removeSort && c.removeSort());
            }

            function checkHasDetail() {
                let detailTemplate = $(element).find('dev-tag-grid-detail').html();
                if (!detailTemplate) return;

                scope.detailTemplate = detailTemplate;
                scope.expand = item => {
                    let detailOption = scope.detailOption;

                    detailOption && detailOption.init && detailOption.init(item, detailOption);
                    item.detailOption = detailOption;

                    item.expanded = !item.expanded;
                };

                $(element).find('dev-tag-grid-detail').remove();
            }

            checkHasDetail();

            scope.$watch('option.readUrl', () =>
            scope.pageOption.reset && scope.pageOption.reset());
        }
    }
}

