"use strict";

export default class DocsApi{

    constructor(apiPromise){

        this.apiPromise = apiPromise;

    }

    getList() {
        return this.apiPromise.get(`/api/docs`);
    }

    getParentList(){
        return this.apiPromise.get(`/api/docs/parent`);
    }

    savePage(data){
        return this.apiPromise.post(`/api/docs`, data);
    }

    updatePage(id, data){
        return this.apiPromise.put(`/api/docs/${id}`, data);
    }

}