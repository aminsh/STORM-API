import accModule from "../acc.module";

function detailAccountCreateModalController($scope,
                                            $uibModalInstance,
                                            formService,
                                            detailAccountApi,
                                            detailAccountCategoryApi,
                                            logger,
                                            devConstants) {
    "use strict";

    $scope.errors = [];
    $scope.personType = devConstants.enums.PersonType().data;
    $scope.detailAccount = {
        title: '',
        code: '',
        description: '',
        address: '',
        phone: '',
        nationalCode: '',
        email: '',
        personType: null
    };

    detailAccountCategoryApi.getAll()
        .then(result => {
            result.data.forEach(e => e.isSelected = false);
            $scope.detailAccount.detailAccountCategories = result.data;
        });

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        let cmd = {
            code: $scope.detailAccount.code,
            title: $scope.detailAccount.title,
            description: $scope.detailAccount.description,
            detailAccountCategoryIds: $scope.detailAccount.detailAccountCategories
                .asEnumerable()
                .where(e => e.isSelected)
                .select(e => e.id)
                .toArray()
        };

        detailAccountApi.create(cmd)
            .then((result) => {
                logger.success();
                $scope.$broadcast('on-customer-created', result)
                $uibModalInstance.close(result);

            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $uibModalInstance.dismiss();
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