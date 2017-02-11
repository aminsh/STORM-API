import accModule from '../acc.module';

function homeController($scope, $rootScope, devConstants, currentService, navigate) {

    let current = currentService.get();

    if (!current.fiscalPeriod)
        return navigate('createFiscalPeriod');
}

accModule.controller('homeController', homeController);