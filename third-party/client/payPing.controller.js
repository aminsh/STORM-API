"use strict";

export default class PayPingController{

    constructor($state
                ,$scope
                ,formService
                ,$window
                ,branchThirdPartyApi
                ,logger
                ,translate){

        this.$state = $state;
        this.$scope = $scope;
        this.formService = formService;
        this.branchThirdPartyApi = branchThirdPartyApi;
        this.logger = logger;
        this.translate = translate;
        this.payping = {
            username: ""
        };

        $("#payping-username").focus();

    }

    send(form){

        if(form.$invalid)
            return this.formService.setDirty(form);

        this.branchThirdPartyApi
            .setUserName("payping", this.payping.username)
            .then(() => this.logger.success())
            .catch((err) => {
                this.logger.error(this.translate(err[0]))
            })
            .finally(() => this.$state.go("third-party"));

    }

}