"use strict";

import accModule from '../acc.module';
import paymentController from './paymentController';
import {notShouldBeZero} from '../sales/invoiceLines.validations';


function createPaymentService(modalBase) {
    return modalBase({
        controller: 'paymentController',
        controllerAs: 'model',
        templateUrl: 'partials/payment/payment.html',
        size: 'lg'
    });
}

accModule

    .controller('paymentController',paymentController)
    .directive('notShouldBeZero', notShouldBeZero)
    .factory('createPaymentService',createPaymentService)
