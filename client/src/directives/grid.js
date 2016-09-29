import $ from 'jquery';
import accModule from '../acc.module';

function grid(gridFilterCellType, $compile) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div>' +
        '<div ng-transclude style="display: none"></div>' +
        '</div>',
        scope: {
            kOption: '=',
            kDatasource: '=',
            option: '=',
            detailOption: '='
        },
        link: function (scope, element, attrs) {


            var grid = {};

            if (scope.kOption) {
                grid = $(element).kendoGrid(scope.kOption).data("kendoGrid");
            }
            else {
                var option = createKendoGridOption(scope, scope.option);

                if (scope.detailOption) {
                    var detailOption = createKendoGridOption(scope, scope.detailOption);


                    option.detailTemplate = kendo.template('<div class="detail-template"></div>');
                    option.detailInit = function (e) {
                        var detailRow = e.detailRow;
                        var parent = e.data;

                        if (scope.detailOption.url) {
                            var url = scope.detailOption.url(e.data);
                            detailOption.dataSource = new kendo.data.DataSource({
                                transport: {
                                    read: {
                                        url: url,
                                        dataType: "json",
                                        contentType: 'application/json; charset=utf-8',
                                        type: 'GET'
                                    }
                                },
                                schema: {
                                    data: "data",
                                    total: "total"
                                    //model: model
                                },
                                pageSize: option.pageSize || 20,
                                serverPaging: true,
                                serverFiltering: true,
                                serverSorting: true
                            })
                        }

                        detailRow.find('.detail-template').kendoGrid(detailOption);

                        parent.refreshDetail = function () {
                            detailOption.dataSource.read();
                        }
                    }
                }

                var grid = $(element).kendoGrid(option).data("kendoGrid");

                if (option.commandTemplate)
                    option.commandTemplate.commands.forEach(function (cmd) {
                        $(element).on("click", cmd.selector, function (e) {
                            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                            cmd.action(dataItem);
                            scope.$apply();
                        });
                    });
            }

            if (scope.option) {
                scope.option.grid = grid;

                scope.option.refresh = function () {
                    grid.dataSource.read();
                };
            }

            function createKendoGridOption(scope, option) {

                var aggregatesForDateSource = [];

                function setAggregatesForDataSource(column) {
                    let aggregates = column.aggregates;

                    if (!aggregates)
                        return;

                    if (aggregates.length == 0)
                        return;

                    let aggregatesForThisColumn = aggregates.asEnumerable().select(agg=> {
                        return {
                            field: column.name,
                            aggregate: agg
                        };
                    }).toArray();

                    aggregatesForDateSource = aggregatesForDateSource
                        .asEnumerable()
                        .concat(aggregatesForThisColumn)
                        .toArray();
                }

                var cols = option.columns
                    .asEnumerable().select(function (col) {
                        setAggregatesForDataSource(col);

                        return {
                            field: col.name,
                            title: col.title,
                            width: col.width,
                            format: col.format,
                            template: col.template,
                            aggregates: col.aggregates,
                            footerTemplate: col.footerTemplate,
                            filterable: getFilterable(col.type)
                        }
                    }).toArray();

                var model = {fields: {}};
                option.columns.forEach(function (col) {
                    model.fields[col.name] = {type: gridFilterCellType[col.type].modelType};
                });

                var commands = option.commands.asEnumerable().select(function (cmd) {
                    if (typeof cmd == "string")
                        return cmd;

                    return {
                        text: cmd.title,
                        imageClass: cmd.imageClass,
                        click: function (e) {
                            e.preventDefault();

                            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                            cmd.action(dataItem);

                            scope.$apply();
                        }
                    };
                }).toArray();

                if (option.commandTemplate)
                    cols.push({template: kendo.template($(option.commandTemplate.template).html())});

                cols.push({command: commands});

                var filterable = option.filterable == undefined || option.filterable == true
                    ? {
                    mode: 'row',
                    operators: {
                        string: {contains: 'Contains'},
                        number: {
                            eq: 'Equal to',
                            gte: "Greater than or equal to",
                            gt: "Greater than",
                            lte: "Less than or equal to",
                            lt: "Less than"
                        },
                        date: {
                            gt: "After",
                            lt: "Before",
                            eq: "Equal"
                        }
                    }
                }
                    : false;

                var kendGridOption = {
                    dataSource: scope.kDatasource ? scope.kDatasource : new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: option.readUrl,
                                dataType: "json",
                                contentType: 'application/json; charset=utf-8',
                                type: 'GET'
                            },
                            parameterMap: function (options) {
                                return options;
                            }
                        },
                        schema: {
                            data: "data",
                            total: "total",
                            model: model,
                            aggregates: "aggregates"
                        },
                        serverAggregates: true,
                        aggregate: aggregatesForDateSource,
                        pageSize: option.pageSize || 20,
                        serverPaging: true,
                        serverFiltering: true,
                        serverSorting: true
                    }),
                    filterable: filterable,
                    pageable: option.pageable == undefined
                        ? {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    } : option.pageable,
                    sortable: true,
                    columns: cols,
                    selectable: option.selectable,
                    editable: option.editable,
                    resizable: true,
                    change: function () {
                        var current = this.dataItem(this.select());

                        option.current = current;

                        scope.$apply();
                    }
                };

                if (option.toolbar)
                    scope.options.toolbar = kendo.template(scope.toolbar);

                return kendGridOption;
            }

            function getFilterable(type) {
                var filterable = {};
                var cell = gridFilterCellType[type];

                if (cell.hasOwnProperty('cell'))
                    cell = cell.cell;

                filterable.cell = cell;

                return filterable;
            }
        }
    };
}


accModule.directive('devTagGrid', grid);