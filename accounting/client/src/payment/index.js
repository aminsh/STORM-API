"use strict";

import accModule from '../acc.module';
import paymentController from './paymentController';
import {notShouldBeZero} from '../sales/invoiceLines.validations';
import PaymentComponent from "./payment.component";

class PaymentModalController{
    constructor($scope, data){
        this.$scope = $scope;
        this.data = data;
    }

    save(payment){
        this.$scope.$close(payment);
    }

    close(){
        this.$scope.$dismiss();
    }
}

function createPaymentService(modalBase) {
    return modalBase({
        controller: PaymentModalController,
        controllerAs: 'model',
        templateUrl: 'partials/payment/payment.html',
        size: 'lg'
    });
}

accModule

    .controller('paymentController',paymentController)
    .directive('notShouldBeZero', notShouldBeZero)
    .factory('createPaymentService',createPaymentService)
    .directive('devTagPayment', PaymentComponent);
