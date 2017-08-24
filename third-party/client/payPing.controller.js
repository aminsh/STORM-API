"use strict";

export default class PayPingController{

    constructor($scope, formService){

        this.$scope = $scope;
        this.formService = formService;
        this.payping = {
            username: ""
        };

    }

    submitPayPingUserName(form){
        if(form.$invalid)
            return this.formService.setDirty(form);
    }

}