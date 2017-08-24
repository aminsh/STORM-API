"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import invoiceController from './invoiceController';
import invoiceListController from './invoiceListController';
import {totalPrice,sumTotalPrice} from  './invoice.filter';
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

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)
    .directive('notShouldBeZero', notShouldBeZero)
    .controller('invoiceController', invoiceController)
    .controller('invoiceListController', invoiceListController)
    .controller('sendInvoiceEmailController', SendInvoiceEmailController)
    .factory('saleApi', saleApi)
    .factory('sendInvoiceEmail', sendInvoiceEmail);
