import accModule from '../acc.module';

function chequeCategoryCreateModalController($scope, $uibModalInstance, formService, chequeCategoryApi, logger, detailAccountApi, bankApi) {
    "use strict";

    $scope.errors = [];
    $scope.detailAccountDataSource = [];
    $scope.bankDataSource = [];
    $scope.chequeCategory = {
        bankId: '',
        detailAccountId: null,
        totalPages: null,
        firstPageNumber: null
    };
    $scope.isSaving = false;


    init();


    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.removeAll();
        $scope.isSaving = true;

        chequeCategoryApi.create($scope.chequeCategory)
            .then(function (result) {
                logger.success();
                $uibModalInstance.close(result);
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.lastPageNumber = () => {
        let model = $scope.chequeCategory;

        return (model.firstPageNumber && model.totalPages)
            ? model.firstPageNumber + model.totalPages - 1
            : null
    };

    $scope.close = () => $uibModalInstance.dismiss();

    function init() {
        detailAccountApi.getAll().then(result => $scope.detailAccountDataSource = result.data);
        bankApi.getAll().then(result => $scope.bankDataSource = result.data);
    }
}

function chequeCategoryCreateModalService(modalBase) {
    return modalBase({
        controller: chequeCategoryCreateModalController,
        templateUrl: 'partials/modals/chequeCategoryCreate.html'
    });
}

accModule
    .controller('chequeCategoryCreateModalController', chequeCategoryCreateModalController)
    .factory('chequeCategoryCreateModalService', chequeCategoryCreateModalService);
