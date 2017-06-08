"use strict";

export default class SetupChartOfAccounts {
    constructor(chartOfAccountApi, $state) {
        this.accounts = [];
        this.$state = $state;
        this.chartOfAccountApi = chartOfAccountApi;
        this.isWaiting = false;

        chartOfAccountApi.get()
            .then(result => this.accounts = result);
    }

    confirm() {
        this.isWaiting = true;
        this.chartOfAccountApi.create()
            .then(()=> this.$state.go('^.final'));
    }

    ignore() {
        this.$state.go('^.final')
    }
}

SetupChartOfAccounts.$inject = ['chartOfAccountApi', '$state'];