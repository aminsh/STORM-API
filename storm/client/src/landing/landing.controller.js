"use strict";

export default class ResetPassController{

    constructor($scope, setDirty, userApi){

        this.setDirty = setDirty;
        this.userApi = userApi;
        this.scope = $scope;

    }

}

ResetPassController.$inject = [
    '$scope'
    ,'setDirty'
    ,'userApi'
];