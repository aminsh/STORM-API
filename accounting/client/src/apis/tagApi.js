
export default class {
    constructor(apiPromise) {
        this.urlPrefix = '/acc/api/tags';
        this.apiPromise = apiPromise;
    }

    getAll(){
        return this.apiPromise.get(this.urlPrefix);
    }

    create(data){
        return this.apiPromise.post(this.urlPrefix, data);
    }
}

