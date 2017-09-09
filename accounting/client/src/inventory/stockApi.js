"use strict";

class StockApi {

    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.urlPrefix = devConstants.urls.rootUrl;
    }

    getAll(){
        return this.apiPromise.get(`${this.urlPrefix}/stocks`);
    }

    getById(id){
        return this.apiPromise.get(`${this.urlPrefix}/stocks/${id}`);
    }

    create(data){
        return this.apiPromise.post(`${this.urlPrefix}/stocks`, data);
    }

    update(id, data){
        return this.apiPromise.put(`${this.urlPrefix}/stocks/${id}`, data);
    }

    remove(id){
        return this.apiPromise.delete(`${this.urlPrefix}/stocks/${id}`);
    }
}

export default StockApi;