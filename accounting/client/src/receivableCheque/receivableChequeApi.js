"use strict";

export default class {
    constructor(devConstants, apiPromise) {
        this.urlPrefix = devConstants.urls.rootUrl;
        this.apiPromise = apiPromise;
    }

    passCheque(id, data) {
        return this.apiPromise.post(`${this.urlPrefix}/receive/cheques/${id}/pass`, data);
    }

    returnCheque(id, data) {
        return this.apiPromise.post(`${this.urlPrefix}/receive/cheques/${id}/return`, data);
    }
}