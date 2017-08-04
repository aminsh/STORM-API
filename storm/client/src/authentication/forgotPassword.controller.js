"use strict";

export default class ForgotPassController{

    constructor($scope, setDirty, userApi){

        this.setDirty = setDirty;
        this.userApi = userApi;
        this.scope = $scope;

        // ******************************
        // Forgot Password Status Numbers
        // 0 = no-thing happened
        // 1 = email sent successfully
        // 2 = email is not exists
        // 3 = server error like 404
        $scope.sendForgotPassStatus = 0;
        // ******************************

    }

    send(form, email){

        if(form.$invalid){
            return this.setDirty(form);
        } else {
            let t = this;
            this.userApi
                .forgotPassword(email)
                .then(function(data){
                    t.scope.sendForgotPassStatus = 1;
                    console.log('We have sent the link to your email. Check your email please !');
                    return;
                })
                .catch(function(errors){
                    if(errors[0] == "Email not found"){
                        t.scope.sendForgotPassStatus = 2;
                        console.log('The email is not exists in the system. You can try again !');
                        return;
                    }
                    t.scope.sendForgotPassStatus = 3;
                    console.log(err);
                });
        }

    }




}

ForgotPassController.$inject = [
    '$scope'
    ,'setDirty'
    ,'userApi'
];