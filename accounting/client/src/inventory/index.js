"use strict";

import accModule from '../acc.module';
import StockApi from './stockApi';
import StocksController from './stocks.controller';
import StockEntryController from './stockEntry';
import InventoryController from './inventory.controller';
import InventoriesController from './inventories.controller';
import InventoryDetailController from './inventoryDetail';
import SelectProductFromStockController from './selectProductFromStock';
import InputEntryController from './inputEntry.controller';
import OutputEntryController from './outputEntry.controller';
import PurchaseEntryController from "./purchaseEntryController";
import PurchasesController from "./purchasesController";

function SelectProductFromStockService(modalBase) {
    return modalBase({
        controller: SelectProductFromStockController,
        controllerAs: 'model',
        templateUrl: 'partials/inventory/selectProductFromStock.html'
    });
}

import './inventoryApi';

accModule
    .service('stockApi', StockApi)
    .factory('selectProductFromStockService', SelectProductFromStockService)
    .controller('stocksController', StocksController)
    .controller('stockEntryController', StockEntryController)
    .controller('inventoryController', InventoryController)
    .controller('inventoriesController', InventoriesController)
    .controller('inventoryDetailController', InventoryDetailController)
    .controller('selectProductFromStockController', SelectProductFromStockController)
    .controller('inputEntryController', InputEntryController)
    .controller('outputEntryController', OutputEntryController)
    .controller('purchaseEntryController', PurchaseEntryController)
    .controller('purchasesController', PurchasesController)

    .config($stateProvider => {

        $stateProvider
            .state('inventory.purchases', {
                url: '/purchases',
                controller: 'purchasesController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/list.html'
            })
            .state('createPurchase', {
                url: '/purchases/create',
                controller: 'purchaseEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            .state('editPurchase', {
                url: '/purchases/:id/edit',
                controller: 'purchaseEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            /*.state('viewPurchase', {
                url: '/purchases/:id/view',
                controller: 'purchaseViewController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceView.html'
            });*/
    });

