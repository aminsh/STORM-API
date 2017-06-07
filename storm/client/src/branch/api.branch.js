"use strict";

export default class BranchApi {
    constructor(Api) {
        this.Api = Api;
        this.prefixUrl = '/api/branches';
    }

    create(data){
        return this.Api.post(`${this.prefixUrl}`, data);
    }

    getMyBranches(){
        return this.Api.get(`${this.prefixUrl}/my`);
    }
}

BranchApi.$inject = ['Api'];