"use strict";

export default class FiscalPeriodApi {
    constructor(Api) {
        this.Api = Api;
        this.prefixUrl = '/acc/api';
    }

    create(data){
        return this.Api.post(`${this.prefixUrl}/fiscal-periods`, data);
    }

    setSettings(){
        return this.Api.post(`${this.prefixUrl}/settings`);
    }
}

FiscalPeriodApi.$inject = ['Api'];