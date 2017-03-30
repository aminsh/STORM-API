import accModule from '../acc.module';

function chequeCategoryUpdateModalController($scope, $modalInstance, formService, chequeCategoryApi, logger, data, devConstants) {
    "use strict";

    let id = data.id;
    $scope.errors = [];
    $scope.chequeCategory = {
        bankId: '',
        detailAccountId: null,
        totalPages: null,
        firstPageNumber: null
    }

    chequeCategoryApi.getById(id)
        .then((result)=> $scope.chequeCategory = result);

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.removeAll();

        $scope.isSaving = true;

        chequeCategoryApi.update($scope.chequeCategory)
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
                url: devConstants.urls.detailAccount.all()
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
                url: devConstants.urls.bank.all()
            }
        },
        schema: {
            data: 'data'
        }
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
