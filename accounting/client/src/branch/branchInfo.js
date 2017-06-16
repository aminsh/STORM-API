"use strict";

export default class {
    constructor(branchApi, logger, formService) {
        this.branchApi = branchApi;
        this.formService = formService;
        this.logger = logger;

        this.isSaving = false;
        this.errors = [];

        branchApi.getCurrent()
            .then(result => this.branch = result);
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.isSaving = true;
        this.errors = [];

        this.branchApi.save(this.branch)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(this.isSaving = false);
    }

    logoUploaded(fileName) {
        this.branch.logoFileName = fileName;
    }
}