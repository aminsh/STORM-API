export default class {

    constructor(apiPromise, localStorageService) {
        this.apiPromise = apiPromise;
        this.localStorageService = localStorageService;

        this.urlPrefix = '/acc/api/detail-accounts';
    }

    get data() {
        return JSON.parse(this.localStorageService.get('detail-accounts'));
    }

    set data(data) {
        this.localStorageService.set('detail-accounts', JSON.stringify(data));
    }

    sync() {
        let localStorageService = this.localStorageService;

        if (localStorageService.keys().includes('detail-accounts'))
            return;

        let promise = this.apiPromise.get(this.urlPrefix);

        promise.then(result => this.data = result.data);

        return promise;
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        return this.data.asEnumerable().single(e => e.id == id);
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
