"use strict";

export default class ResetPassController{

    constructor($scope, $stateParams, setDirty, userApi){

        this.setDirty = setDirty;
        this.userApi = userApi;
        this.scope = $scope;

        if($stateParams.token){

            $scope.showPage = true;

        } else {

            $scope.showPage = false;

        }

    }

}

ResetPassController.$inject = [
    '$scope'
    ,'$stateParams'
    ,'setDirty'
    ,'userApi'
];