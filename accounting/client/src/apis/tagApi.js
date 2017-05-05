
export default class {
    constructor(apiPromise, localStorageService) {
        this.localStorageService = localStorageService;
        this.urlPrefix = '/acc/api/tags';
        this.apiPromise = apiPromise;
    }

    get data() {
        return JSON.parse(this.localStorageService.get('tags'));
    }

    set data(data) {
        this.localStorageService.set('tags', JSON.stringify(data));
    }

    sync() {
        let localStorageService = this.localStorageService;

        if (localStorageService.keys().includes('tags'))
            return;

        let promise = this.apiPromise.get(this.urlPrefix);

        promise.then(result => this.data = result.data);

        return promise;
    }

    getAll(){
        return this.data;
    }

    create(data){
        return this.apiPromise.post(this.urlPrefix, data);
    }
}

