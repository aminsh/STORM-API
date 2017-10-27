"use strict";

class InventoriesController {

    constructor($scope, $state, translate, devConstants, stockApi) {
        this.$scope = $scope;
        this.$state = $state;
        this.inventoryType = $state.current.name.includes('input') ? 'input' : 'output';

        this.gridOption = {
            name: 'inventories',
            columns: [
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '10%',
                    type: 'date'
                },
                {
                    name: 'number',
                    title: translate('Number'),
                    width: '10%',
                    type: 'number'
                },
                {
                    name: 'ioType',
                    title: translate('Input type'),
                    width: '15%',
                    type: 'string',
                    template: '<span>{{item.ioTypeDisplay}}</span>'
                },
                {
                    name: 'stockDisplay',
                    title: translate('Stock'),
                    width: '15%',
                    type: 'string',
                    filterable: false
                },
                {
                    name: 'description',
                    title: translate('Description'),
                    width: '20%',
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

                        if(this.inventoryType === 'input')
                            this.$state.go('inventoryInputsUpdate', {id: current.id});

                        if(this.inventoryType === 'output')
                            this.$state.go('inventoryOutputsUpdate', {id: current.id});
                    }
                }
            ],
            readUrl: '',
            sort: [
                {dir: 'desc', field: 'number'}
            ]
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

    create(){

        if(this.inventoryType === 'input')
            this.$state.go('inventoryInputsCreate', {stockId: this.stockId});

        if(this.inventoryType === 'output')
            this.$state.go('inventoryOutputsCreate', {stockId: this.stockId});
    }

    onStockChanged(item) {
        this.$scope.$broadcast(`${this.gridOption.name}/execute-advanced-search`, {stockId: item.id});
    }

    showDetail(current) {
        this.$state.go('.detail', {id: current.id});
    }
}

export default InventoriesController;