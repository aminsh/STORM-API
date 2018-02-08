import accModule from "../acc.module";

function detailAccountUpdateModalController($scope, $uibModalInstance, formService, detailAccountApi, logger, data, devConstants, $rootScope, confirmWindowClosing) {

    confirmWindowClosing.activate();

    let id = data.id;

    $scope.personType = devConstants.enums.PersonType().data;
    $scope.detailAccountTypes = devConstants.enums.DetailAccountType().data;

    $scope.errors = [];
    detailAccountApi.getById(id)
        .then(result => $scope.detailAccount = result);

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        let cmd = {
            code: $scope.detailAccount.code,
            title: $scope.detailAccount.title,
            detailAccountType: $scope.detailAccount.detailAccountType,
            description: $scope.detailAccount.description,
            detailAccountCategoryIds: $scope.detailAccount.detailAccountCategories
                .asEnumerable()
                .where(e => e.isSelected)
                .select(e => e.id)
                .toArray()
        };

        detailAccountApi.update(id, cmd)
            .then((result) => {
                $rootScope.$broadcast('onDetailAccountChanged');
                logger.success();
                $uibModalInstance.close(result);
                confirmWindowClosing.activate();
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => {
        $uibModalInstance.dismiss();
        confirmWindowClosing.activate();
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