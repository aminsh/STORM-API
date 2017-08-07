"use strict";

export default class SettingsApi {
    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.urlPrefix = devConstants.urls.rootUrl;
        this.userApiUrlPrefix = devConstants.urls.userApiUrl;
    }

    get() {
        return this.apiPromise.get(`${this.urlPrefix}/settings`);
    }

    save(data) {
        return this.apiPromise.put(`${this.urlPrefix}/settings`, data);
    }

    // [START] SMRSAN
    changePassSave(data){
        return this.apiPromise.put(`${this.userApiUrlPrefix}/change-password`);
    }
    // [-END-] SMRSAN

}