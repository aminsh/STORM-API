
export default class {
    constructor(apiPromise,devConstants) {
        this.urlPrefix = `${devConstants.urls.rootUrl}/tags`;
        this.apiPromise = apiPromise;
    }

    getAll(){
        return this.apiPromise.get(this.urlPrefix);
    }

    create(data){
        return this.apiPromise.post(this.urlPrefix, data);
    }
}

