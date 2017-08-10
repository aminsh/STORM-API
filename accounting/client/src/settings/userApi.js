"use strict";

export default class UserApi {
    constructor(apiPromise, devConstants) {
        this.apiPromise = apiPromise;
        this.urlPrefix = devConstants.urls.rootUrl;
        this.userApiUrlPrefix = devConstants.urls.userApiUrl;
    }

    /*get() {
        return this.apiPromise.get(`${this.urlPrefix}/settings`);
    }*/

    savePassword(data) {
        return this.apiPromise.put(`${this.userApiUrlPrefix}/change-password`, data);
    }
    saveImage(data){
        return this.apiPromise.put(`${this.userApiUrlPrefix}/change-image`, data);
    }
    getImage(){
        return this.apiPromise.get(`${this.userApiUrlPrefix}/get-user-image`);
    }

}