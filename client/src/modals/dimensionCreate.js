import accModule from '../acc.module';
import config from '../localData/config';

function dimensionCreateModalController(data,
                                        $scope, $modalInstance, dimensionApi) {
    "use strict";

    $scope.errors = [];
    $scope.dimension = {
        title: '',
        code: '',
        description: ''
    }

    $scope.save = function (form) {
        if (form.$invalid)
            return;

        $scope.errors.asEnumerable().removeAll();

        dimensionApi.create(data.categoryId, $scope.dimension)
            .then(function (result) {
                $modalInstance.close(result);
            })
            .catch(function (errors) {
                $scope.errors = errors;
            });
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