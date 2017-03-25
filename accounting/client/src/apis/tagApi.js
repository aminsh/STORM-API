
export default class {
    constructor(apiPromise) {
        this.urlPrefix = '/acc/api/tags';
        this.apiPromise = apiPromise;
    }

    create(data){
        return this.apiPromise.post(this.urlPrefix, data);
    }
}

