"use strict";

export default class ResetPassController{

    constructor($scope, $location, $stateParams, setDirty, userApi){

        this.setDirty = setDirty;
        this.userApi = userApi;
        this.scope = $scope;

        $scope.token = $stateParams.token;
        $scope.showForm = false;
        $scope.showPass = false;
        $scope.inputType = "password";
        $scope.toggleInputType = this.toggleInputType;

        // ******************************
        // Forgot Password Status Numbers
        // 0 = no-thing happened
        // 1 = reset password is done successfully
        // 2 = token is wrong
        // 3 = server error like 404
        // 4 = you are already logged in
        $scope.sendResetPassStatus = 0;
        // ******************************

        if($stateParams.token !== undefined){

            // Check if token is invalid
            userApi
                .encodeResetPassToken($stateParams.token)
                .then((data) => {

                    $scope.showForm = data.isValid;
                    if(!data.isValid) $location.path(`/404`);

                })
                .catch((err) => {

                    $scope.showForm = false;
                    $location.path(`/404`);

                });

        } else {

            $scope.showForm = false;
            $location.path("/404");

        }

    }

    toggleInputType(){

        this.scope.showPass = !this.scope.showPass;
        this.scope.inputType = (this.scope.showPass)? "text":"password";

    }

    send(form, newPass){// Change Password

        if(form.$invalid){
            return this.setDirty(form);
        } else {
            this.userApi
                .resetPassword(newPass,this.scope.token)
                .then((data) => {
                    console.log('Your password has changed successfully !');
                    this.scope.sendResetPassStatus = 1;
                    this.scope.showForm = false;
                })
                .catch((errors) => {
                    if(errors[0] === "Token is invalid"){
                        console.log('The token is worng !');
                        this.scope.sendResetPassStatus = 2;
                        return;
                    } else if(errors[0] === "You are already logged in"){
                        console.log('You are already logged in !!!');
                        this.scope.sendResetPassStatus = 4;
                        return;
                    }
                    this.scope.sendResetPassStatus = 3;
                    console.log(err);
                });
        }

    }

}

ResetPassController.$inject = [
    '$scope'
    ,'$location'
    ,'$stateParams'
    ,'setDirty'
    ,'userApi'
];