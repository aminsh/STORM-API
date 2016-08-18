import accModule from '../acc.module';

function detailAccountCreateModalController($scope, $modalInstance, formService, detailAccountApi, logger) {
    "use strict";

    $scope.errors = [];
    $scope.detailAccount = {
        title: '',
        code: '',
        description: ''
    }

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return;

        $scope.errors.asEnumerable().removeAll();
        $scope.isSaving = true;

        detailAccountApi.create($scope.detailAccount)
            .then(function (result) {
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