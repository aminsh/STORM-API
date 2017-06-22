"use strict";

export default class {
    constructor(devConstants, apiPromise) {
        this.urlPrefix = devConstants.urls.rootUrl;
        this.apiPromise = apiPromise;
    }

    transferMoney(data) {
        return this.apiPromise.post(`${this.urlPrefix}/transfer-money`, data);
    }
}