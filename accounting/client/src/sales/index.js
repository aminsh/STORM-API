"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import SaleInvoiceEntryController from './saleEntryController';
import SaleViewController from './saleViewConroller';
import invoiceListController from './invoiceListController';
import saleApi from "./saleApi";
import './purchaseApi';
import SendInvoiceEmailController from "./sendInvoiceEmail.controller";


function sendInvoiceEmail(modalBase){

    return modalBase({
        controller: "sendInvoiceEmailController",
        controllerAs: 'model',
        templateUrl: 'partials/sales/sendInvoiceEmail.html',
        size: "sm"
    });

}

accModule

    .directive('notShouldBeZero', notShouldBeZero)

    .controller('saleInvoiceEntryController', SaleInvoiceEntryController)
    .controller('saleViewController', SaleViewController)
    .controller('invoiceListController', invoiceListController)
    .controller('sendInvoiceEmailController', SendInvoiceEmailController)

    .factory('saleApi', saleApi)
    .factory('sendInvoiceEmail', sendInvoiceEmail);
