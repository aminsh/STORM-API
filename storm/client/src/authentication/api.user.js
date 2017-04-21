"use strict";

export default class UserApi {
    constructor(Api) {
        this.Api = Api;
        this.prefixUrl = '/api/users';
    }

    login(data) {
        return this.Api.post(`${this.prefixUrl}/login`, data);
    }

    logout() {
        return this.Api.post(`${this.prefixUrl}/logout`);
    }

    register(data) {
        return this.Api.post(`${this.prefixUrl}/register`, data);
    }

    isUniqueEmail(email){
        return this.Api.get(`${this.prefixUrl}/is-unique-email/${email}`)
    }

    getByEmail(email){
        return this.Api.get(`${this.prefixUrl}/by-email/${email}`);
    }

    getAuthReturnUrl(){
        return this.Api.get(`${this.prefixUrl}/return-url`);
    }
}

UserApi.$inject = ['Api'];