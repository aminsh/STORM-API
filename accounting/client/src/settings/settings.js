"use strict";

export default class {
    constructor(branchApi){
       this.branchApi = branchApi;
       this.apiKey = '';
    }

    getApiKey(){
        this.branchApi.getApiKey()
            .then(result => this.apiKey = result.apiKey);
    }
}