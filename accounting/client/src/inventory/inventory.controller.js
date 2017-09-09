"use strict";

class InventoryController {
    constructor($scope, $rootScope, inventoryApi, translate) {

        this.tabs = [
            {
                heading: `<i>${translate('Stocks')}</i>`,
                route: 'inventory.stocks'
            },
            {
                heading: `<i>${translate('Inventory inputs')}</i>`,
                route: 'inventory.inputs'
            }
        ];
    }
}

export default InventoryController;