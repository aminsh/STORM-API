import accModule from '../acc.module';
import Collection from 'dev.collection';

function dimensionUpdateModalController(data, $scope, $modalInstance, dimensionApi) {
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
            return;

        Collection.removeAll($scope.errors);

        $scope.isSaving = true;


        dimensionApi.update(data.id, $scope.dimension)
            .then(function (result) {
                $modalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $modalInstance.dismiss();
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