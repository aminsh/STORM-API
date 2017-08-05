"use strict";

export default class DetailAccountCategoryApi {
    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.urlPrefix = devConstants.urls.rootUrl;
    }

    getAll() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-account-categories`);
    }

    getById(id) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-account-categories/${id}`);
    }

    create(entity) {
        return this.apiPromise.post(`${this.urlPrefix}/detail-account-categories`, entity);
    }

    update(id, entity) {
        return this.apiPromise.put(`${this.urlPrefix}/detail-account-categories/${id}`, entity);
    }

    remove(id) {
        return this.apiPromise.delete(`${this.urlPrefix}/detail-account-categories/${id}`);
    }
}