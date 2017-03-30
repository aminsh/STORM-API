import accModule from '../acc.module';

function detailAccountCreateModalController($scope, $uibModalInstance, formService, detailAccountApi, logger) {
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

        $scope.errors.removeAll();

        $scope.isSaving = true;

        detailAccountApi.create($scope.detailAccount)
            .then((result) => {
                logger.success();
                $uibModalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
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