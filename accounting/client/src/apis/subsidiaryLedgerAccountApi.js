export default class {

    constructor(apiPromise) {
        this.apiPromise = apiPromise;

        this.urlPrefix = '/acc/api/subsidiary-ledger-accounts';
    }

    getAll() {
        return this.apiPromise.get(this.urlPrefix);
    }

    getById(id) {
        return this.apiPromise.get(`${this.urlPrefix}/${id}`);
    }

    create(id, data) {
        return this.apiPromise.post(`${this.urlPrefix}/general-ledger-account/${id}`, data);
    }

    update(id, data) {
        return this.apiPromise.put(`${this.urlPrefix}/${id}`, data);
    }

    remove(id) {
        return this.apiPromise.delete(`${this.urlPrefix}/${id}`);
    }
}



