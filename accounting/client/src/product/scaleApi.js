"use strict";

export default class {

    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.baseUrl = `${devConstants.urls.rootUrl}/scales`
    }

    create(data) {
        return this.apiPromise.post(this.baseUrl, data);
    }
}