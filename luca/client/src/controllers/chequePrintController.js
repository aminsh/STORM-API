"use strict"

export default function ($scope, chequeApi, $routeParams) {
    $scope.cheque = {}
    $scope.canShow = false;

    chequeApi.getById($routeParams.id).then(result => {
        $scope.cheque = result;
        $scope.canShow = true;
    });
}