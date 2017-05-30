"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import salesInvoiceController from './salesInvoiceController';
import salesListController from './salesListController';
import {totalPrice,sumTotalPrice} from  './saleInvoice.filter';
import './saleInvoiceApi';

accModule

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)

    .directive('notShouldBeZero', notShouldBeZero)
    .controller('salesInvoiceController', salesInvoiceController)
    .controller('salesListController', salesListController);
