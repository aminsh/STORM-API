"use strict";

export default class ProfileController {
    constructor(branchApi, $window, $cookies) {
        this.$window = $window;
        this.$cookies = $cookies;
        this.logger= logger;

        branchApi.getMyBranches().then(result => {
            this.branches = result;
        });
    }

    select(branch){
        this.$cookies.put('branch-id', branch.id, {path: '/'});
        let url = `${this.$window.location.origin}/acc`;
        this.$window.open(url, '_self');
    }
}

ProfileController.$nject= ['branchApi', '$window', '$cookies'];