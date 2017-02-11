"use strict";

export default class currentService {
    constructor($cookies) {
        this.current = {
            fiscalPeriod: null,
            mode: null,
            branch: null,
            user: JSON.parse(localStorage.getItem('currentUser'))
        };

        this.$cookies = $cookies;
    }

    setFiscalPeriod(fiscalPeriodId) {
        this.$cookies.put('current-period', fiscalPeriodId);
        this.current.fiscalPeriod = fiscalPeriodId == 0 ? null : fiscalPeriodId;
    }

    setMode(mode) {
        this.$cookies.put('current-mode', mode);
        this.current.mode = mode;
    }

    setBranch(branch) {
        this.current.branch = branch;
    }

    get() {
        return this.current;
    }
}