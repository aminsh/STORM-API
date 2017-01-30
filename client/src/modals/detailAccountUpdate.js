import accModule from '../acc.module';
import Collection from 'dev.collection';

function detailAccountUpdateModalController($scope, $modalInstance, data, formService, detailAccountApi, logger) {
    "use strict";

    let id = data.id;

    $scope.errors = [];
    $scope.detailAccount = {
        title: '',
        code: '',
        description: ''
    };

    detailAccountApi.getById(id)
        .then((result)=> $scope.detailAccount = result);

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        Collection.removeAll($scope.errors);

        $scope.isSaving = true;

        detailAccountApi.update(data.id, $scope.detailAccount)
            .then((result) => {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $modalInstance.dismiss();

    $scope.activate = ()=> {
        detailAccountApi.activate(id)
            .then(()=> {
                $scope.detailAccount.isActive = true;
                logger.success();
            })
            .catch((errors)=> $scope.errors = errors);
    };

    $scope.deactivate = ()=> {
        detailAccountApi.deactivate(id)
            .then(()=> {
                $scope.detailAccount.isActive = false;
                logger.success();
            })
            .catch((errors)=> $scope.errors = errors);
    };
}

function detailAccountUpdateModalService(modalBase) {
    return modalBase({
        controller: detailAccountUpdateModalController,
        templateUrl: 'partials/modals/detailAccountUpdate.html'
    });
}

accModule
    .controller('detailAccountUpdateModalController', detailAccountUpdateModalController)
    .factory('detailAccountUpdateModalService', detailAccountUpdateModalService);