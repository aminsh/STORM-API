"use strict";

export default class SetupChartOfAccounts {
    constructor(chartOfAccountApi) {
        this.accounts = [];

        chartOfAccountApi.get()
            .then(result => this.accounts = result);
    }

    save(form){

    }
}

SetupChartOfAccounts.$inject = ['chartOfAccountApi'];