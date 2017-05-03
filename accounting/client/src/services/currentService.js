"use strict";

export default class currentService {
    constructor($cookies, $rootScope) {
        this.current = {
            today: null,
            fiscalPeriod: null,
            mode: null,
            branch: null,
            user: JSON.parse(localStorage.getItem('currentUser'))
        };

        this.$cookies = $cookies;
        this.$rootScope = $rootScope;
    }

    setToday(today) {
        this.current.today = today;
    }

    setFiscalPeriod(fiscalPeriodId) {
        this.$cookies.put('current-period', fiscalPeriodId);
        this.current.fiscalPeriod = fiscalPeriodId == 0 ? null : fiscalPeriodId;

        this.$rootScope.$broadcast('fiscal-period-changed', {fiscalPeriodId});
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