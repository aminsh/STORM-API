"use strict";

"use strict";

export default class ChartOfAccountApi {
    constructor(Api) {
        this.Api = Api;
        this.prefixUrl = '/acc/api/general-ledger-accounts';
    }

    get(){
        return this.Api.get(`${this.prefixUrl}/default/chart-of-accounts`);
    }

    create(){
        return this.Api.post(`${this.prefixUrl}/default/chart-of-accounts`);
    }
}

ChartOfAccountApi.$inject = ['Api'];