"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import SaleViewController from './saleViewConroller';
import SalesController from './sales.controller';
import saleApi from "./saleApi";
import returnSaleApi from "./returnSaleApi"
import './purchaseApi';
import SendInvoiceEmailController from "./sendInvoiceEmail.controller";
import ReturnSaleController from "./returnSaleEntryController";
import SaleController from "./sale.controller";
import ReturnSalesController from "./returnSales.controller";
import SaleInvoiceEntryController from './saleEntryController';
import ReturnSaleEntryController from './returnSaleEntryController'
import ReturnSaleViewVController from "./returnSaleViewController";
import ConfirmSavingInvoiceWithEffectsController from "./confirmSavingInvoiceWithEffectsController"


function sendInvoiceEmail(modalBase) {

    return modalBase({
        controller: "sendInvoiceEmailController",
        controllerAs: 'model',
        templateUrl: 'partials/sales/sendInvoiceEmail.html',
        size: "sm"
    });

}

function confirmSavingInvoiceWithEffectsService(modalBase) {

    return modalBase({
        controller: "confirmSavingInvoiceWithEffectsController",
        controllerAs: 'model',
        templateUrl: 'partials/sales/confirmSavingInvoiceWithEffectsController.html'
    });

}


accModule

    .directive('notShouldBeZero', notShouldBeZero)

    .controller('saleInvoiceEntryController', SaleInvoiceEntryController)
    .controller('saleViewController', SaleViewController)
    .controller('salesController', SalesController)
    .controller('sendInvoiceEmailController', SendInvoiceEmailController)
    .controller('returnSaleController', ReturnSaleController)
    .controller('saleController', SaleController)
    .controller('returnSalesController', ReturnSalesController)
    .controller('returnSaleEntryController', ReturnSaleEntryController)
    .controller('returnSaleViewController', ReturnSaleViewVController)
    .controller('confirmSavingInvoiceWithEffectsController', ConfirmSavingInvoiceWithEffectsController)

    .factory('saleApi', saleApi)
    .factory('returnSaleApi', returnSaleApi)
    .factory('sendInvoiceEmail', sendInvoiceEmail)
    .factory('confirmSavingInvoiceWithEffectsService', confirmSavingInvoiceWithEffectsService)

    .config($stateProvider => {

        $stateProvider
            .state('sale', {
                url: '/sale',
                controller: 'saleController',
                controllerAs: 'model',
                template: `<dev-tag-content dev-attr-title="{{'Sale'|translate}}">
                            <dev-tag-tab data="model.tabs" ></dev-tag-tab>
                            </dev-tag-content>`
            })
            .state('sale.sales', {
                url: '/sales',
                controller: 'salesController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/list.html'
            })
            .state('createSale', {
                url: '/sale/sales/create',
                controller: 'saleInvoiceEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            .state('editSale', {
                url: '/sale/sales/:id/edit',
                controller: 'saleInvoiceEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            .state('viewSale', {
                url: '/sale/sales/:id/view',
                controller: 'saleViewController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceView.html'
            })
            .state('sale.returnSales', {
                url: '/return-sales',
                controller: 'returnSalesController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/list.html'
            })
            .state('createReturnSale', {
                url: '/sale/return-sales/create',
                controller: 'returnSaleEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            .state('editReturnSale', {
                url: '/sale/return-sales/edit/:id',
                controller: 'returnSaleEntryController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceEntry.html'
            })
            .state('viewReturnSale', {
                url: '/sale/return-sales/:id/view',
                controller: 'returnSaleViewController',
                controllerAs: 'model',
                templateUrl: 'partials/sales/invoiceView.html'
            })
    });