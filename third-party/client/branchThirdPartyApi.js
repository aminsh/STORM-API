"use strict";

export default class {

    constructor(apiPromise, promise){
        this.apiPromise = apiPromise;
        this.promise = promise;
    }

    get(){
        return this.apiPromise.get('/api/branch-third-party');
    }

    setUserName(thirdPartyKey ,username){
        return this.apiPromise.post(`/api/branch-third-party/${thirdPartyKey}`, { username });
    }

    hasPayPing(){
        return this.promise.create((resolve, reject) => {
            this.apiPromise.get('/api/branch-third-party/payping')
                .then((data) => resolve(!!(data)))
                .catch(() => reject());
        });
    }

    delete(key){
        return this.apiPromise.delete(`/api/branch-third-party/${key}`);
    }

}