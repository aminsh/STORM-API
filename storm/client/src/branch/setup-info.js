"use strict";

export default class SetupInfoController {
    constructor(branchApi, setDirty, $state) {
        this.branchApi = branchApi;
        this.setDirty = setDirty;
        this.$state = $state;

        this.branch = {
            name: '',
            logo: '',
            phone: '',
            address: ''
        };
    }

    createBranch(form) {
        if (form.$invalid)
            return this.setDirty(form);

        this.branchApi.create(this.branch)
            .then(result => {
                this.$state.go('^.firstPeriod');
            });
    }
}

SetupInfoController.$inject = ['branchApi', 'setDirty', '$state'];