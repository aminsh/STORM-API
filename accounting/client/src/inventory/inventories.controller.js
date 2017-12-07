"use strict";

class InventoriesController {

    constructor($scope, $state, translate, devConstants, stockApi, logger, confirm, navigate, inventoryApi, $timeout) {
        this.$scope = $scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.logger = logger;
        this.navigate = navigate;
        this.confirm = confirm;
        this.translate = translate;
        this.inventoryApi = inventoryApi;
        this.inventoryType = $state.current.name.includes('input') ? 'input' : 'output';

        this.gridOption = {
            name: 'inventories',
            columns: [
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '10%',
                    type: 'date',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    },
                },
                {
                    name: 'number',
                    title: translate('Number'),
                    width: '10%',
                    type: 'number',
                    template: '<span>{{item.number}}</span>',
                    css: 'text-center',
                    header: {
                        css: 'text-center'
                    },
                },
                {
                    name: 'ioType',
                    title: this.inventoryType === 'input'
                        ? translate('Input type')
                        : translate('Output type'),
                    width: '15%',
                    type: 'string',
                    template: '<span>{{item.ioTypeDisplay}}</span>'
                },
                {
                    name: 'stockDisplay',
                    title: translate('Stock'),
                    width: '25%',
                    type: 'string',
                    filterable: false
                },
                {
                    name: 'description',
                    title: translate('Description'),
                    width: '40%',
                    type: 'string'
                }

            ],
            commands: [
                {
                    title: translate('Show'),
                    icon: 'fa fa-eye text-success fa-lg',
                    action: current => this.showDetail(current),
                },
                {
                    title: translate('Edit'),
                    icon: 'fa fa-edit text-success fa-lg',
                    action: current => {

                        if (this.inventoryType === 'input')
                            this.$state.go('inventoryInputsUpdate', {id: current.id});

                        if (this.inventoryType === 'output')
                            this.$state.go('inventoryOutputsUpdate', {id: current.id});
                    }
                },
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger fa-lg',
                    action: current => {

                        let func;

                        if (this.inventoryType === 'input')
                            func = this.inventoryApi.removeInput;

                        if (this.inventoryType === 'output')
                            func = this.inventoryApi.removeOutput;

                        this.confirm(
                            translate('Are you sure ?'),
                            translate(`Remove current ${this.inventoryType}`)
                        )
                            .then(() => $timeout(() => func(current.id)
                                    .then(() => {
                                        this.logger.success();
                                        this.gridOption.refresh();
                                    })
                                    .catch(errors => this.logger.error(errors.join('<br/>')))
                                , 1000));
                    }
                },
                {
                    title: translate('Price entry'),
                    icon: 'fa fa-usd text-success fa-lg',
                    action: current => this.$state.go('.setPrice', {id: current.id}),
                    canShow: () => this.inventoryType === 'input'
                },
                {
                    title: translate('Calculate price'),
                    icon: 'fa fa-calculator text-success fa-lg',
                    action: current => {
                        inventoryApi.outputCalculatePrice(current.id)
                            .then(()=> logger.success())
                            .catch(errors => logger.error(errors.join('<br/>')));
                    },
                    canShow: () => this.inventoryType === 'output'
                }
            ],
            readUrl: '',
            sort: [
                {dir: 'desc', field: 'number'}
            ],
            multiSelectable: true
        };

        stockApi.getAll()
            .then(result => {
                const item = result.data.length > 0 ? result.data[0] : null;
                if (!item) return;

                this.gridOption.readUrl = this.inventoryType === 'input'
                    ? devConstants.urls.inventory.getAllInputs()
                    : devConstants.urls.inventory.getAllOutputs();
            });

        this.getAllStockUrl = devConstants.urls.stock.getAll();
    }

    create() {

        if (this.inventoryType === 'input')
            this.$state.go('inventoryInputsCreate', {stockId: this.stockId});

        if (this.inventoryType === 'output')
            this.$state.go('inventoryOutputsCreate', {stockId: this.stockId});
    }

    onStockChanged(item) {
        this.$scope.$broadcast(`${this.gridOption.name}/execute-advanced-search`, {stockId: item.id});
    }

    showDetail(current) {
        this.$state.go('.detail', {id: current.id});
    }

    inventoryOutput() {
        const ids = this.gridOption.getSelected();
        if (ids.length === 0) {
            this.logger.error(this.translate('Select inventory output'));
        }
        else {
            let reportParam = {ids};
            this.navigate(
                'report.print',
                {key: 800},
                reportParam);
        }
    }

    inventoryInput() {
        const ids = this.gridOption.getSelected();
        if (ids.length === 0) {
            this.logger.error(this.translate('Select inventory input'));
        }
        else {
            let reportParam = {ids};
            this.navigate(
                'report.print',
                {key: 801},
                reportParam);
        }
    }
}

export default InventoriesController;