"use strict";

export default class PayPingController{

    constructor($state ,$scope, formService, branchThirdPartyApi, logger){

        this.$state = $state;
        this.$scope = $scope;
        this.formService = formService;
        this.branchThirdPartyApi = branchThirdPartyApi;
        this.logger = logger;
        this.payping = {
            username: ""
        };

    }

    send(form){

        if(form.$invalid)
            return this.formService.setDirty(form);

        this.branchThirdPartyApi
            .setUserName("payping", this.payping.username)
            .then(() => this.logger.success())
            .finally(() => this.$state.go("third-party"));

    }

}