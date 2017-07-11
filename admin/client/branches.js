"use strict";

export default class BranchesController {
    constructor(branchApi, logger) {
        this.branchApi = branchApi;
        this.logger = logger;

        branchApi.getAll()
            .then(result => this.branches = result);
    }

    activate(branch) {
        this.branchApi.activate(branch.id)
            .then(() => {
                branch.status='active'
            this.logger.success()
        });
    }

    deactivate(branch) {
        this.branchApi.deactivate(branch.id)
            .then(() => {
                branch.status='pending'
            this.logger.success()
        });
    }

    addMe(branch){
        this.branchApi.addMeToBranch(branch.id)
            .then(() => this.logger.success());
    }

}