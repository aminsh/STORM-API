"use strict";

export default class {
    constructor(settingsApi, userApi, formService, logger, devConstants, $scope, $timeout, translate) {
        this.settingsApi = settingsApi;
        this.userApi = userApi;
        this.formService = formService;
        this.logger = logger;
        this.errors = [];
        this.isSaving = false;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.translate = translate;

        this.urls = {
            getAllBanks: devConstants.urls.bank.getAll()
        };

        settingsApi.get().then(result => this.settings = result);

        this.changePassword = {
            currentPassword: null,
            newPassword: null,
            newPasswordConfirm: null,
            errors: []
        };

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

    changePassSave(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        this.userApi.save({
            currentPass: this.changePassword.currentPassword
            , newPass: this.changePassword.newPassword
        })
            .then(() => {
                this.logger.success();
                this.changePassword.currentPassword = null;
                this.changePassword.newPassword = null;
                this.changePassword.newPasswordConfirm = null;
                this.changePassword.showChangePassMsg = false;
                this.changePassword.errors = [];
                this.$timeout(() => this.formService.setClean(form));
            })
            .catch(errors => {
                this.errors = errors;
                this.changePassword.errors = [this.translate("The password is wrong")];
                this.changePassword.showChangePassMsg = true;
            })
            .finally(() => this.isSaving = false);
    }

}