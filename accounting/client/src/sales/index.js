"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import invoiceController from './invoiceController';
import invoiceListController from './invoiceListController';
import {totalPrice,sumTotalPrice} from  './invoice.filter';
import './saleApi';
import './purchaseApi';

accModule

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)
    .directive('notShouldBeZero', notShouldBeZero)
    .controller('invoiceController', invoiceController)
    .controller('invoiceListController', invoiceListController);
