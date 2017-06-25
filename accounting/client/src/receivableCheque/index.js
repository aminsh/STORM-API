"use strict";

import accModule from "../acc.module";

import ReceivableChequesController from "./receivableCheques";
import PassReceivableChequeController from "./passReceivableCheque";
import ReturnReceivableChequeController from "./returnReceivableCheque";
import ReceivableChequeApi from "./receivableChequeApi";


function passReceivableCheque(modalBase) {
    return modalBase({
        controller: 'passReceivableChequeController',
        controllerAs: 'model',
        templateUrl: 'partials/receivableCheque/passReceivableCheque.html',
        size: 'lg'
    });
}

function returnReceivableCheque(modalBase) {
    return modalBase({
        controller: 'returnReceivableChequeController',
        controllerAs: 'model',
        templateUrl: 'partials/receivableCheque/returnReceivableCheque.html',
    });
}

accModule
    .controller('receivableChequesController', ReceivableChequesController)
    .controller('passReceivableChequeController', PassReceivableChequeController)
    .controller('returnReceivableChequeController', ReturnReceivableChequeController)
    .service('receivableChequeApi', ReceivableChequeApi)
    .factory('passReceivableCheque', passReceivableCheque)
    .factory('returnReceivableCheque', returnReceivableCheque);
