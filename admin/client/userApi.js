"use strict";

export default class UserApi {
    constructor(apiPromise) {
        this.apiPromise = apiPromise;
    }

    getAll() {
        return this.apiPromise.get('/api/users');
    }

    remove(id) {
        return this.apiPromise.delete(`/api/users/${id}`);
    }

    getConnecteds(){
        return this.apiPromise.get('/api/users/connected');
    }

    total(){
        return this.apiPromise.get('/api/users/total');
    }

}