"use strict";

export default class ResetPassController{

    constructor($scope, $location, $stateParams, setDirty, userApi){

        this.setDirty = setDirty;
        this.userApi = userApi;
        this.scope = $scope;
        $scope.token = $stateParams.token;

        console.log($stateParams.token);
        if($stateParams.token !== undefined){

            // Check if token is invalid
            userApi
                .encodeResetPassToken($stateParams.token)
                .then((data) => {

                    $scope.tokenId = data.id;

                })
                .catch((err) => {

                    console.log("Error: ",err);
                    //$location.path(`/404`);

                });

        } else {

            console.log(`Type of token = ${$stateParams.token}`);
            // $location.path("/404");

        }

    }

}

ResetPassController.$inject = [
    '$scope'
    ,'$stateParams'
    ,'setDirty'
    ,'userApi'
    ,'$location'
];