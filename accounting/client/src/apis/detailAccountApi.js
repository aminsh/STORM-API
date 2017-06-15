export default class {

    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;

        this.urlPrefix = `${devConstants.urls.rootUrl}/detail-accounts`;
    }


    getAll() {
        return this.apiPromise.get(this.urlPrefix);
    }

    getById(id) {
        return this.apiPromise.get(`${this.urlPrefix}/${id}`);
    }

    create(data) {
        return this.apiPromise.post(this.urlPrefix, data);
    }

    update(id, data) {
        return this.apiPromise.put(`${this.urlPrefix}/${id}`, data);
    }

    remove(id) {
        return this.apiPromise.delete(`${this.urlPrefix}/${id}`);
    }

    activate(id) {
        return this.apiPromise.put(`${this.urlPrefix}/${id}/activate`, data);
    }

    deactivate(id) {
        return this.apiPromise.put(`${this.urlPrefix}/${id}/deactivate`, data);
    }
}
