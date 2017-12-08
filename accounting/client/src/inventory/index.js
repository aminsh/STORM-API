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
import PurchaseViewController from "./purchaseViewController";
import InventoryProductsController from "./inventory.products.controller";

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
    .controller('purchaseViewController', PurchaseViewController)
    .controller('inventoryProductsController',InventoryProductsController)

    .config($stateProvider => {

        $stateProvider
            .state('inventory.inputs.setPrice', {
                url: '/set-price/:id',
                onEnter: ($modelFactory, $stateParams) => {
                    $modelFactory.create({
                        controller: 'inventoryDetailController',
                        controllerAs: 'model',
                        size: 'lg',
                        templateUrl: 'partials/inventory/inventoryDetail.html',
                        resolve: {data: {id: $stateParams.id, isPriceEntry: true}}
                    });
                }
            })

            .state('inventory.purchases', {
                url: '/purchases',
                controller: 'purchasesController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/list.html'
            })
            .state('inventory.purchases.detail', {
                url: '/detail/:id',
                onEnter: ($modelFactory) => {
                    $modelFactory.create({
                        controller: 'purchaseViewController',
                        controllerAs: 'model',
                        size: 'lg',
                        templateUrl: 'partials/inventory/purchaseView.html'
                    });
                }
            })

            .state('inventory.purchases.detail.payment', {
                url: '/payment/:amount/:receiveOrPay',
                controller: 'paymentController',
                controllerAs: 'model',
                onExit: $state => $state.go('^'),
                template: 'partials/payment/payment.entry.template.html'
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
            .state('inventory.products', {
                url: '/products',
                controller: 'inventoryProductsController',
                controllerAs: 'model',
                templateUrl: 'partials/inventory/inventory.products.html'
            })
    });

