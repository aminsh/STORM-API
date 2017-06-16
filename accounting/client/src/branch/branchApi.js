"use strict";

export default class {

    constructor(apiPromise) {
        this.apiPromise = apiPromise;
    }

    getMyBranches() {
        return this.apiPromise.get('/api/branches/my');
    }

    getCurrent() {
        return this.apiPromise.get('/api/branches/current');
    }

    getApiKey() {
        return this.apiPromise.get('/api/branches/current/api-key');
    }

    save(data) {
        return this.apiPromise.put('/api/branches/current', data);
    }
}