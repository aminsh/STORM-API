"use strict";

export default class SettingsApi {
    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.urlPrefix = devConstants.urls.rootUrl;
    }

    get() {
        return this.apiPromise.get(`${this.urlPrefix}/settings`);
    }

    save(data) {
        return this.apiPromise.put(`${this.urlPrefix}/settings`, data);
    }
}