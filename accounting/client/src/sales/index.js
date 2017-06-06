"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import salesInvoiceController from './salesInvoiceController';
import cashPaymentController from './cashPaymentController';
import salesListController from './salesListController';
import {totalPrice,sumTotalPrice,sumTotalTaxPrice} from  './salesInvoice.filter';
import './salesInvoiceApi';

accModule

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)
    .filter('sumTotalTaxPrice',sumTotalTaxPrice)
    .directive('notShouldBeZero', notShouldBeZero)
    .controller('salesInvoiceController', salesInvoiceController)
    .controller('cashPaymentController', cashPaymentController)
    .controller('salesListController', salesListController);
