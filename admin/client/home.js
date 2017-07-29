"use strict";

export default class HomeController {
    constructor(userApi, pubSub, branchApi) {
        this.userApi = userApi;
        this.branchApi = branchApi;

        this.fetchConnectedUsers();
        this.totalBenaches();
        this.gettotalUsers();

        pubSub.subscribe('update-users', () => this.fetchConnectedUsers());
    }

    fetchConnectedUsers() {
        this.userApi.getConnecteds()
            .then(result => this.users = result);
    }

    totalBenaches() {
        this.branchApi.total()
            .then(result => this.totalBranches = result.total);
    }

    gettotalUsers(){
        this.userApi.total()
            .then(result => this.totalUsers = result.total);
    }
}