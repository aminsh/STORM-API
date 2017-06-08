"use strict";

export default class {

    constructor(apiPromise) {
        this.apiPromise = apiPromise;
        this.baseUrl = '/acc/api/products'
    }

    getAll() {
        return this.apiPromise.get(this.baseUrl);
    }

    getById(id){
        return this.apiPromise.get(`${this.baseUrl}/${id}`);
    }

    create(data) {
        return this.apiPromise.post(this.baseUrl, data);
    }

    update(id, data) {
        return this.apiPromise.put(`${this.baseUrl}/${id}`, data);
    }

    remove(id) {

    }
}