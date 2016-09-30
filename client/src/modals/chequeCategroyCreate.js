import accModule from '../acc.module';

function chequeCategoryCreateModalController($scope, $modalInstance, formService, chequeCategoryApi, logger, constants) {
    "use strict";

    $scope.errors = [];
    $scope.chequeCategory = {
        bankId: '',
        detailAccountId: null,
        totalPages: null,
        firstPageNumber: null
    }

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();
        $scope.isSaving = true;

        chequeCategoryApi.create($scope.chequeCategory)
            .then(function (result) {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.lastPageNumber = ()=> {
        let model = $scope.chequeCategory;

        return (model.firstPageNumber && model.totalPages)
            ? model.firstPageNumber + model.totalPages - 1
            : null
    };

    $scope.close = ()=> $modalInstance.dismiss();

    $scope.detailAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.detailAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.bankDataSource = {
        type: 'json',
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.bank.all()
            }
        },
        schema: {
            data: 'data'
        }
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
