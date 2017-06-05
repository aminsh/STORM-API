"use strict";

export default class SetupInfoController {
    constructor(branchApi, setDirty, $state) {
        this.branchApi = branchApi;
        this.setDirty = setDirty;
        this.$state = $state;

        this.isWaiting = false;

        this.branch = {
            name: '',
            logo: '',
            phone: '',
            address: '',
            registrationNumber: ''
        };
    }

    save(form) {
        if (form.$invalid)
            return this.setDirty(form);

        this.isWaiting = true;

        this.branchApi.create(this.branch)
            .then(result => {
                this.$state.go('^.firstPeriod');
            })
            .finally(() => this.isWaiting = false);
    }

    logoUploaded(fileName) {
        this.branch.logo = fileName;
    }
}

SetupInfoController.$inject = ['branchApi', 'setDirty', '$state'];