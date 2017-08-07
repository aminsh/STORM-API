"use strict";

export default class LoginController {
    constructor(
        userApi,
        setDirty, 
        $rootScope, 
        $scope, 
        $state, 
        $location, 
        $window,
        $cookies) {
        
        $rootScope.noFooter = true;
        $scope.$on('$destroy', () => {
            $rootScope.noFooter = false;
        });
        
        this.userApi = userApi;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.setDirty = setDirty;
        this.isError = false;
        this.user = {
            email: '',
            password: ''
        };

        this.$cookies = $cookies;
        this.$window = $window;
        this.returnUrl = $location.search().returnUrl;

        if(this.returnUrl)
            $cookies.put('return-url', this.returnUrl);
    }

    login(form) {
        if (form.$invalid)
            return this.setDirty(form);
        
        this.userApi.login(this.user)
            .then(result => {
                if (this.returnUrl)
                    this.$window.location = this.returnUrl;
                else {

                    this.$rootScope.currentUser = result.currentUser;
                    this.$rootScope.isAuthenticated = true;
                    this.$state.go('profile');
                }
            })
            .catch(err => this.isError = true);
    }

    loginByGoogle(){
        let url = `${this.$window.location.origin}/auth/google`;
        this.$window.open(url, '_self');
    }
}

LoginController.$inject = [
    'userApi',
    'setDirty',
    '$rootScope',
    '$scope',
    '$state',
    '$location',
    '$window',
    '$cookies'
];

