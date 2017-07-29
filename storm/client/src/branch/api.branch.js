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

    remove(id){
        return this.Api.delete(`${this.prefixUrl}/${id}`);
    }
}

BranchApi.$inject = ['Api'];