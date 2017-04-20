import accModule from '../acc.module';

function chequeCategoryUpdateModalController($scope,
                                             $q,
                                             $uibModalInstance,
                                             formService,
                                             chequeCategoryApi,
                                             logger,
                                             data,
                                             detailAccountApi,
                                             bankApi) {

    let id = data.id;
    $scope.errors = [];
    $scope.detailAccountDataSource = [];
    $scope.bankDataSource = [];
    $scope.chequeCategory = {
        bankId: '',
        detailAccountId: null,
        totalPages: null,
        firstPageNumber: null
    };

    init();


    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        chequeCategoryApi.update(id,$scope.chequeCategory)
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
        $q.all([detailAccountApi.getAll(), bankApi.getAll()])
            .then(result => {
                $scope.detailAccountDataSource = result[0].data;
                $scope.bankDataSource = result[1].data;

                chequeCategoryApi.getById(id)
                    .then(result => $scope.chequeCategory = result);
            });
    }
}

function chequeCategoryUpdateModalService(modalBase) {
    return modalBase({
        controller: chequeCategoryUpdateModalController,
        templateUrl: 'partials/modals/chequeCategoryUpdate.html'
    });
}

accModule
    .controller('chequeCategoryUpdateModalController', chequeCategoryUpdateModalController)
    .factory('chequeCategoryUpdateModalService', chequeCategoryUpdateModalService);
