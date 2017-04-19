import accModule from '../acc.module';

function detailAccountUpdateModalController($scope, $uibModalInstance, formService, detailAccountApi, logger, data) {
    "use strict";

    let id = data.id;

    $scope.errors = [];
    detailAccountApi.getById(id)
        .then(result => $scope.detailAccount = result);

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        detailAccountApi.update(id, $scope.detailAccount)
            .then((result) => {
                logger.success();
                $uibModalInstance.close(result);
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $uibModalInstance.dismiss();
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