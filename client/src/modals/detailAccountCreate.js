import accModule from '../acc.module';
import Collection from 'dev.collection';

function detailAccountCreateModalController($scope, $modalInstance, formService, detailAccountApi, logger) {
    "use strict";

    $scope.errors = [];
    $scope.detailAccount = {
        title: '',
        code: '',
        description: ''
    };

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        Collection.removeAll($scope.errors);

        $scope.isSaving = true;

        detailAccountApi.create($scope.detailAccount)
            .then((result) => {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $modalInstance.dismiss();
}

function detailAccountCreateModalService(modalBase) {
    return modalBase({
        controller: detailAccountCreateModalController,
        templateUrl: 'partials/modals/detailAccountCreate.html'
    });
}

accModule
    .controller('detailAccountCreateModalController', detailAccountCreateModalController)
    .factory('detailAccountCreateModalService', detailAccountCreateModalService);