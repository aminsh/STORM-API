import $ from 'jquery';
import accModule from '../acc.module';
import Collection from 'dev.collection';

let translate = JSON.parse(localStorage.translate);
let dimensionCategories = JSON.parse(localStorage.dimensionCategories).data;

kendo.translate = (key)=> {
    let value = translate[key];

    if (!value) return key;
    return value;
};

kendo.toAmount = (amount)=> {
    return kendo.toString(amount, '#,##0;(#,##0)');
};

kendo.dimensionCategories = dimensionCategories;

function grid(gridFilterCellType, $compile, translate) {
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
            detailOption: '=',
            onCurrentChanged: '&'
        },
        controller: ()=> {
        },
        link: function (scope, element, attrs) {
            let extra = scope.option.extra || null;

            scope.$on('{0}/execute-advanced-search'.format(scope.option.name), (e, data)=> {
                extra = {filter: data};
                grid.dataSource.read();
            });

            var grid = {};

            if (scope.kOption) {
                grid = $(element).kendoGrid(scope.kOption).data("kendoGrid");
            }
            else {
                var option = createKendoGridOption(scope, scope.option);

                let detailTemplate = $(element).find('.detail-template')
                if (detailTemplate.lenght != 0) {
                    option.detailTemplate = detailTemplate.html();
                }


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
                $(element).find('.k-grid-content').css('height', scope.option.gridSize || '500px');

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

                function setState() {
                    let name = scope.option.name;

                    if (!name || name == '')
                        return grid.dataSource.read();

                    let gridState = JSON.parse(localStorage.getItem(`${name}-grid-state`));

                    if (!gridState) return grid.dataSource.read();
                    ;

                    let state = gridState.options;

                    state.columns = new Collection(state.columns)
                        .asEnumerable()
                        .where(c=> !c.hasOwnProperty('command'))
                        .concat([{command: new Collection(scope.option.commands).asEnumerable().select(commandFactory).toArray()}])
                        .toArray();

                    grid.setOptions(state);

                    extra = scope.option.resolveExtraFilter ? {filter: scope.option.resolveExtraFilter(gridState.extra.data)} : null;
                    scope.option.setExtraFilter(gridState.extra);

                    grid.dataSource.read();
                }

                scope.option.saveState = (extra)=> {
                    let name = scope.option.name;

                    if (!name || name == '')
                        return;

                    let gridState = {
                        options: grid.getOptions(),
                        extra: extra
                    };

                    localStorage.setItem(`${name}-grid-state`, JSON.stringify(gridState));
                };

                setState();

            }

            function createKendoGridOption(scope, option) {

                var aggregatesForDateSource = [];

                function setAggregatesForDataSource(column) {
                    let aggregates = column.aggregates;

                    if (!aggregates)
                        return;

                    if (aggregates.length == 0)
                        return;

                    let aggregatesForThisColumn = new Collection(aggregates).asEnumerable().select(agg=> {
                        return {
                            field: column.name,
                            aggregate: agg
                        };
                    }).toArray();

                    aggregatesForDateSource = new Collection(aggregatesForDateSource)
                        .asEnumerable()
                        .concat(aggregatesForThisColumn)
                        .toArray();
                }

                var cols = new Collection(option.columns)
                    .asEnumerable()
                    .select(function (col) {
                        setAggregatesForDataSource(col);

                        return {
                            field: col.name,
                            title: col.title,
                            width: col.width,
                            format: col.format,
                            template: col.template,
                            aggregates: col.aggregates,
                            headerTemplate: col.headerTemplate,
                            footerTemplate: col.footerTemplate,
                            filterable: col.filterable == undefined ? getFilterable(col.type) : col.filterable
                        }
                    }).toArray();

                var model = {fields: {}};
                option.columns.forEach(function (col) {
                    model.fields[col.name] = {
                        type: gridFilterCellType[col.type].modelType,

                    };
                });

                var commands = new Collection(option.commands).asEnumerable()
                    .select(commandFactory).toArray();

                if (option.commandTemplate)
                    cols.push({template: kendo.template($(option.commandTemplate.template).html())});

                cols.push({command: commands});

                var filterable = option.filterable == undefined || option.filterable == true
                    ? {
                    mode: 'row',
                    operators: {
                        string: {contains: 'Contains'},
                        number: {
                            eq: translate('Equal to'),
                            gte: translate("Greater than or equal to"),
                            gt: translate("Greater than"),
                            lte: translate("Less than or equal to"),
                            lt: translate("Less than")
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
                                if (extra)
                                    options.extra = extra;

                                scope.onCurrentChanged({current: false});

                                return options;
                            }
                        },
                        schema: {
                            data: option.dataMapper ? option.dataMapper : 'data',
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
                    autoBind: false,
                    filterable: filterable,
                    pageable: option.pageable == undefined
                        ? {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    } : option.pageable,
                    toolbar: ["excel", "pdf"],
                    excel: {
                        filterable: true,
                        fileName: `${option.name}.xlsx`,
                        allPages: true
                    },
                    pdf: {
                        allPages: true,
                        fileName: `${option.name}.pdf`,
                        avoidLinks: true,
                        paperSize: "A4",
                        margin: {top: "2cm", left: "1cm", right: "1cm", bottom: "1cm"},
                        landscape: true,
                        repeatHeaders: true
                    },
                    sortable: true,
                    allowCopy: true,
                    columns: cols,
                    selectable: option.selectable,
                    editable: option.editable,
                    resizable: true,
                    change: function () {
                        var current = this.dataItem(this.select());

                        option.current = current;

                        scope.onCurrentChanged({current: current});

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

            function commandHandler(cmd) {
                return function (e) {
                    e.preventDefault();

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    cmd.action(dataItem);

                    scope.$apply();
                }
            }

            function commandFactory(cmd) {
                if (typeof cmd == "string")
                    return cmd;

                return {
                    text: cmd.title,
                    imageClass: cmd.imageClass,
                    click: commandHandler(cmd)
                };
            }
        }
    };
}

function detail() {
    return {
        restrict: 'E',
        template: '<div ng-transclude class="detail-template"></div>',
        transclude: true,
        scope: {},
        replace: true,
        require: '^devTagGrid',
        link: function (scope, element, attrs) {

        }
    };
}

accModule.directive('devTagGrid', grid)
    .directive('devTagGridDetail', detail);