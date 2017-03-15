export default class LoginController {
    constructor(api, $http, setDirty, $rootScope, $scope, $state, $location, $window) {
        $rootScope.noFooter = true;
        $scope.$on('$destroy', () => {
            $rootScope.noFooter = false;
        })
        self.$rootScope = $rootScope;
        self.vm = this;
        self.$state = $state
        self.api = api;
        self.$http = $http;
        self.setDirty = setDirty;
        self.vm.isError = false;
        self.vm.user = {
            email: '',
            password: ''
        };

        this.$window = $window;
        this.returnUrl = $location.search().returnUrl;
    }

    login(form) {
        if (form.$invalid) {
            return self.setDirty(form);
        }
        $http.post(self.api('users.auth.login'), self.vm.user)
            .then(data => {

                if (data.data.isValid === true) {
                    if (this.returnUrl)
                        this.$window.location = this.returnUrl;
                    else {
                        self.$rootScope.currentUser = data.data.returnValue.currentUser;
                        self.$state.go("home");
                    }

                } else {
                    self.vm.isError = true;
                }
            })
            .catch(function (error) {
                console.log("error: ", error);
                self.vm.isError = true;
            })
    }
}

LoginController.$inject = ['api', '$http', 'setDirty', "$rootScope", "$scope", "$state", "$location", "$window"];
