"use strict";

export default class FiscalPeriodApi {
    constructor(Api) {
        this.Api = Api;
        this.prefixUrl = '/acc/api/fiscal-periods';
    }

    create(data){
        return this.Api.post(`${this.prefixUrl}`, data);
    }
}

FiscalPeriodApi.$inject = ['Api'];