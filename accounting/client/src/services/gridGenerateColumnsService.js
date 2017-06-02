import accModule from '../acc.module';

function gridGenerateColumnsService() {
    return generate
}

function generate(columnsOptions, filterableColumnFactory) {
    if (!columnsOptions) return null;

    return columnsOptions.asEnumerable()
        .select(c => new KendoGridColumn(c, filterableColumnFactory))
        .toArray();
}

class KendoGridColumn {
    constructor(item, filterableColumnFactory) {
        this.field = item.name;
        this.title = item.title;
        this.width = item.width;
        this.format = item.format;
        this.template = item.template;
        this.aggregates = item.aggregates;
        this.footerTemplate = item.footerTemplate;
        this.filterable = item.filterable == undefined ? filterableColumnFactory(item.type) : item.filterable;

    }
}

accModule.factory('gridGenerateColumnsService', gridGenerateColumnsService);