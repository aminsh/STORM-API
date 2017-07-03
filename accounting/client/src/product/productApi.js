"use strict";

export default class {

    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.baseUrl = `${devConstants.urls.rootUrl}/products`
    }

    getAll() {
        return this.apiPromise.get(this.baseUrl);
    }

    getById(id) {
        return this.apiPromise.get(`${this.baseUrl}/${id}`);
    }

    create(data) {
        return this.apiPromise.post(this.baseUrl, data);
    }

    update(id, data) {
        return this.apiPromise.put(`${this.baseUrl}/${id}`, data);
    }

    remove(id) {
        return this.apiPromise.delete(`${this.baseUrl}/${id}`);
    }
    summary(id){
         return this.apiPromise.get(`${this.baseUrl}/${id}/summary/sale/by-month`);
    }
}