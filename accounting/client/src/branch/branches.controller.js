"use strict";

export default class BranchesController {
    constructor($scope, branchApi,$location, $state, $timeout, $rootScope, $cookies, translate, confirm, logger) {

        this.$scope = $scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$cookies = $cookies;
        this.$location = $location;
        this.translate = translate;
        this.confirm = confirm;
        this.logger = logger;
        this.branchApi = branchApi;

        this.fetch();
    }

    fetch(){
        this.branchApi.getMyBranches().then(result => {
            this.branches = result;
        });
    }

    select(branch) {

        this.$rootScope.$broadcast('onBranchChanged', branch);

        const returnUrl = this.$location.search().returnUrl;

        this.$location.search('');

        return returnUrl ? this.$location.path(returnUrl) : this.$state.go('home');


    }

    remove(branch){
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate('Remove me from branch {0}').format(branch.name)
        )
            .then(() => {
                this.branchApi.removeMeFromBranch(branch.id)
                    .then(() => {
                        this.logger.success();
                        this.fetch();
                    })
                    .catch((errors) => {
                        this.$timeout(() => this.logger.error(errors.join('<br/>')), 100);
                    });
            });
    }
}
