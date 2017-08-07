"use strict";

export default class {
    constructor(settingsApi, userApi, formService, logger, devConstants, $scope) {
        this.settingsApi = settingsApi;
        this.userApi = userApi;
        this.formService = formService;
        this.logger = logger;
        this.errors = [];
        this.isSaving = false;
        this.$scope = $scope;
        $scope.showChangePassMsg = false;
        // 0 = no-thing happened
        // 1 = success
        // 2 = wrong currentPassword
        $scope.changePassSuccess = 0;

        this.urls = {
            getAllBanks: devConstants.urls.bank.getAll()
        };

        settingsApi.get().then(result => this.settings = result);
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);
        this.errors = [];
        this.isSaving = true;

        this.settingsApi.save(this.settings)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    changePassSave(form, currentPass, newPass){
        if (form.$invalid)
            return this.formService.setDirty(form);
        this.errors = [];
        this.isSaving = true;
        this.userApi.save({
            currentPass: currentPass
            , newPass: newPass
        }).then(() => { this.logger.success();this.$scope.changePassSuccess = 1; })
            .catch(errors => { this.errors = errors;this.$scope.changePassSuccess = 2; })
            .finally(() => this.isSaving = false);
        this.$scope.showChangePassMsg = true;
    }

}