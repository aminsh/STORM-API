"use strict";

import accModule from '../acc.module';
import {notShouldBeZero} from './purchaseLines.validations';
import purchaseController from './purchaseController';
import purchasesListController from './purchasesListController';
import {totalPrice,sumTotalPrice,sumTotalTaxPrice} from  '../sales/salesInvoice.filter';
import './purchaseApi';

accModule

    .filter('totalPrice', totalPrice)
    .filter('sumTotalPrice', sumTotalPrice)
    .filter('sumTotalTaxPrice', sumTotalTaxPrice)
    .directive('notShouldBeZero', notShouldBeZero)
    .controller('purchaseController', purchaseController)
    .controller('purchasesListController', purchasesListController);
