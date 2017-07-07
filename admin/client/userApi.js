"use strict";

export default class UserApi{
    constructor(apiPromise){
        this.apiPromise = apiPromise;
    }

    getAll(){
        return this.apiPromise.get('/api/users');
    }
}