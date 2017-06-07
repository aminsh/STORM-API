"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './invoiceLines.validations';
import PurchasesInvoiceController from './purchasesInvoiceController';
import PurchasesListController from './purchasesListController';
import {totalPrice,sumTotalPrice,sumTotalTaxPrice} from  './purchaseInvoice.filter';
import './purchaseInvoiceApi';

accModule

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)
    .filter('sumTotalTaxPrice',sumTotalTaxPrice)
    .directive('notShouldBeZero', notShouldBeZero)
    .controller('purchasesInvoiceController', PurchasesInvoiceController)
    .controller('purchasesListController', PurchasesListController);

