"use strict";

class InventoryController {
    constructor($scope, $rootScope, inventoryApi, translate, $state) {

        this.tabs = [
            {
                heading: `<i>${translate('Stocks')}</i>`,
                route: 'inventory.stocks'
            },
            {
                heading: `<i>${translate('Inventory inputs')}</i>`,
                route: 'inventory.inputs'
            },
            {
                heading: `<i>${translate('Inventory outputs')}</i>`,
                route: 'inventory.outputs'
            },
            {
                heading: `<i>${translate('Purchase invoice')}</i>`,
                route: 'inventory.purchases'
            }
        ];
    }
}

export default InventoryController;