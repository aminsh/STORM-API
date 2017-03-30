import accModule from '../acc.module';
import config from '../localData/config';

function dimensionCreateModalController(data,
                                        $scope, $modalInstance, dimensionApi, formService) {
    "use strict";

    $scope.errors = [];
    $scope.dimension = {
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

        dimensionApi.create(data.categoryId, $scope.dimension)
            .then(function (result) {
                $modalInstance.close(result);
            })
            .catch(function (errors) {
                $scope.errors = errors;
            }).finally(()=> $scope.isSaving = false);
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}

function dimensionCreateModalService(modalBase) {
    return modalBase({
        controller: dimensionCreateModalController,
        templateUrl: 'partials/modals/dimensionCreate.html'
    });
}

accModule
    .controller('dimensionCreateModalController', dimensionCreateModalController)
    .factory('dimensionCreateModalService', dimensionCreateModalService);