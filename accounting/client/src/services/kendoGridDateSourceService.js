import accModule from '../acc.module';

function kendoGridDateSourceService() {
    return dataSourceFactory;
}

function dataSourceFactory(item) {
    return new KendoGridDateSource(item);
}

class KendoGridDateSource {
    constructor(item) {
        this.transport = {
            read: {
                url: item.readUrl,
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                type: 'GET'
            },
            parameterMap: function (options) {
                if (extra)
                    options.extra = extra;

                return options;
            }
        };

        this.schema = {
            data: "data",
            total: "total",
            model: model,
            aggregates: "aggregates"
        };

        this.serverAggregates = true;
        this.aggregate = aggregatesForDateSource;
        this.pageSize = item.pageSize || 20;
        this.serverPaging = true;
        this.serverFiltering = true;
        this.serverSorting = true;
    }
}

accModule.factory('kendoGridDateSourceService', kendoGridDateSourceService);
