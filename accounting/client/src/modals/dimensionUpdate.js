import accModule from '../acc.module';

function dimensionUpdateModalController(data, $scope, $uibModalInstance, dimensionApi, formService) {
    "use strict";

    $scope.errors = [];
    $scope.dimension = {
        title: '',
        code: '',
        description: ''
    }


    dimensionApi.getById(data.id)
        .then((result)=> $scope.dimension = result);

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;


        dimensionApi.update(data.id, $scope.dimension)
            .then(function (result) {
                $uibModalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
}

function dimensionUpdateModalService(modalBase) {
    return modalBase({
        controller: dimensionUpdateModalController,
        templateUrl: 'partials/modals/dimensionUpdate.html'
    });
}

accModule
    .controller('dimensionUpdateModalController', dimensionUpdateModalController)
    .factory('dimensionUpdateModalService', dimensionUpdateModalService);