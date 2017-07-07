"use strict";

export default class UsersController {
    constructor(userApi) {
        userApi.getAll()
            .then(result => this.users = result);
    }
}