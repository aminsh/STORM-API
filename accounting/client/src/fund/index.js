"use strict";

import accModule from '../acc.module';
import fundListController from './fundListController';
import fundCreateController from './fundCreateController';
import './fundApi';

function createFundService(modalBase) {
    return modalBase({
        controller: fundCreateController,
        controllerAs: 'model',
        templateUrl: 'partials/fund/fundCreate.html'
    });
}
accModule

    .controller('fundListController',fundListController)
    .controller('fundCreateController',fundCreateController)
    .factory('createFundService', createFundService);
