"use strict";

export default class {
    constructor(settingsApi, formService, logger, devConstants) {
        this.settingsApi = settingsApi;
        this.formService = formService;
        this.logger = logger;
        this.errors = [];
        this.isSaving = false;

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
}