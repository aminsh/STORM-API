"use strict";

import accModule from "../acc.module";

import PayableChequesController from "./payableCheques";
import PassPayableChequeController from "./passPayableCheque";
import ReturnPayableChequeController from "./returnPayableCheque";
import PayableChequeApi from "./payableChequeApi";


function passPayableCheque(modalBase) {
    return modalBase({
        controller: 'passPayableChequeController',
        controllerAs: 'model',
        templateUrl: 'partials/payableCheque/passPayableCheque.html',
        size: 'sm'
    });
}

function returnPayableCheque(modalBase) {
    return modalBase({
        controller: 'returnPayableChequeController',
        controllerAs: 'model',
        templateUrl: 'partials/payableCheque/returnPayableCheque.html',
    });
}

accModule
    .controller('payableChequesController', PayableChequesController)
    .controller('passPayableChequeController', PassPayableChequeController)
    .controller('returnPayableChequeController', ReturnPayableChequeController)
    .service('payableChequeApi', PayableChequeApi)
    .factory('passPayableCheque', passPayableCheque)
    .factory('returnPayableCheque', returnPayableCheque);
