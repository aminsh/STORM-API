class InventoryProductsController {
    constructor($scope, productApi, devConstants, translate, navigate, reportParameters, logger) {
        this.$scope = $scope;
        this.productApi = productApi;
        this.devConstants = devConstants;
        this.translate = translate;
        this.navigate = navigate;
        this.reportParameters = reportParameters;
        this.logger = logger;

        this.getAllStockUrl = devConstants.urls.stock.getAll();
        this.getFixedStatus = devConstants.enums.getInventoryFixedStatus().data;

        this.filter = {
            fixedStatus: 'all',
            stockId: 'all'
        }
        ;

        this.gridOption = {
            name: 'inventoryProduct',
            readUrl: devConstants.urls.inventory.getAllInventoryProducts(),
            columns: [
                {
                    name: 'referenceId', title: translate('Reference Code'), width: '20%', type: 'string',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                },
                {
                    name: 'title',
                    title: translate('Title'),
                    width: '70%',
                    type: 'string'
                },
                {
                    name: 'productType',
                    title: translate('Type'),
                    width: '10%',
                    template: '{{item.productTypeDisplay}}',
                    type: 'productType',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    }
                }
            ],
            command: [],
            multiSelectable: true
        };

        this.stockResolver = result => {
            result.data.unshift({id: 'all', title: translate('All inventory')});
            return result;
        };
    }

    onStockChanged(item) {
        const extra = item.id === 'all' ? {} : {filter: {stockId: item.id}};
        this.filter.stockId = item.id;
        this.$scope.$broadcast(`${this.gridOption.name}/execute-advanced-search`, extra);
    }

    inventoryProductsTurnover() {
        const ids = this.gridOption.getSelected(),
            fixedType = this.filter.fixedStatus,
            stockId = this.filter.stockId;

        if (ids.length === 0)
            return this.logger.error(this.translate('Select product'));

        this.reportParameters.show([{name: "date"}])
            .then(params => {
                Object.assign(params, {ids: ids}, {fixedType: fixedType},{stockId: stockId});
                this.navigate(
                    'report.print',
                    {key: 900},
                    params);
            });

    };

    inventoryProductsTurnoverTotal() {
        const ids = this.gridOption.getSelected(),
            fixedType = this.filter.fixedStatus,
            stockId = this.filter.stockId;
        if (ids.length === 0)
            return this.logger.error(this.translate('Select product'));

        this.reportParameters.show([{name: "date"}])
            .then(params => {
                Object.assign(params, {ids: ids}, {fixedType: fixedType},{stockId: stockId});
                this.navigate(
                    'report.print',
                    {key: 901},
                    params);
            });
    }
}

export default InventoryProductsController;