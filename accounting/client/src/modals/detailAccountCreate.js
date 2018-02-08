import accModule from "../acc.module";

function detailAccountCreateModalController($scope,
                                            $rootScope,
                                            $uibModalInstance,
                                            formService,
                                            detailAccountApi,
                                            detailAccountCategoryApi,
                                            logger,
                                            devConstants,
                                            confirmWindowClosing) {

    confirmWindowClosing.activate();

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

    $scope.detailAccountTypes = devConstants.enums.DetailAccountType().data;

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
            detailAccountType: $scope.detailAccount.detailAccountType,
            detailAccountCategoryIds: $scope.detailAccount.detailAccountCategories
                .asEnumerable()
                .where(e => e.isSelected)
                .select(e => e.id)
                .toArray()
        };

        detailAccountApi.create(cmd)
            .then((result) => {
                logger.success();
                $rootScope.$broadcast('onDetailAccountChanged');
                $uibModalInstance.close(result);
                confirmWindowClosing.deactivate();
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => {
        $uibModalInstance.dismiss();
        confirmWindowClosing.deactivate();
    };
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