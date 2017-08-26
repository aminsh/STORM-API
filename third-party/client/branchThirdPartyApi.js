"use strict";

export default class {

    constructor(apiPromise){
        this.apiPromise = apiPromise;
    }

    get(){
        return this.apiPromise.get('/api/branch-third-party');
    }

    setUserName(thirdPartyKey ,username){
        return this.apiPromise.post(`/api/branch-third-party/${thirdPartyKey}`, { username });
    }

}