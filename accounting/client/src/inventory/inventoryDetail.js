"use strict";

class InventoryDetailController {
    constructor($scope, devConstants, inventoryApi, data, translate) {

        this.$scope = $scope;

        inventoryApi.getById(data.id)
            .then(result => this.inventory = result);

        this.gridOption = {
            columns: [
                {
                    name: 'productId',
                    title: translate('Good'),
                    template: '{{item.productDisplay}}',
                    type: 'string'
                },
                {
                    name: 'quantity',
                    title: translate('Quantity'),
                    template: '<span>{{item.quantity|number}}</span>',
                    type: 'number'
                },
                {
                    name: 'unitPrice',
                    title: translate('Unit price'),
                    width: '15%',
                    template: '<span>{{item.unitPrice|number}}</span>',
                    type: 'number'
                },
                {
                    name: 'totalPrice',
                    title: translate('Total price'),
                    template: '<span>{{(item.quantity * item.unitPrice)|number}}</span>',
                    type: 'number',
                    aggregates: ['sum'],
                    footerTemplate: '{{aggregates.sumTotalPrice | number}}'
                }

            ],
            commands: [],
            gridSize: '300px',
            readUrl: devConstants.urls.inventory.getLinesById(data.id)
        };
    }

    close() {
        this.$scope.$dismiss();
    }


}

export default InventoryDetailController;