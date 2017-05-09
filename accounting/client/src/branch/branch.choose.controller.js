"use strict";

export default class {
    constructor($scope,branchApi, dimensionCategoryApi, $state, $timeout, $rootScope, $cookies) {

        this.dimensionCategoryApi = dimensionCategoryApi;
        this.$scope =$scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$cookies = $cookies;

        this.braches = [];
        this.canShowLoading = false;

        branchApi.getMyBranches().then(result => {
            this.branches = result;
            if(result.length == 1)
                this.select(result[0]);
        });
    }

    select(branch) {
        this.$rootScope.branch = branch;
        this.$cookies.put('branch-id', branch.id, {path: '/'});
        this.$scope.$emit('branch-changed', branch);
        this.fetchInitData();
    }

    fetchInitData() {
        this.canShowLoading = true;
        this.dimensionCategoryApi.getAll().then(result => {
            localStorage.setItem('dimensionCategories', JSON.stringify(result.data));

            let translate = JSON.parse(localStorage.getItem('translate'));
            result.data.forEach((c, i) => translate[`Dimension${i + 1}`] = c.title);

            this.canShowLoading = false;

            this.$state.go('home');
        });
    }
}