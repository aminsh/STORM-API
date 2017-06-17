"use strict";

export default class ProductCategoryApi {
    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.baseUrl = `${devConstants.urls.rootUrl}/product-categories`
    }

    getById(id) {
        return this.apiPromise.get(`${this.baseUrl}/${id}`);
    }

    create(data) {
        return this.apiPromise.post(this.baseUrl, data);
    }

    update(id, data) {
        return this.apiPromise.post(`${this.baseUrl}/${id}`, data);
    }
}