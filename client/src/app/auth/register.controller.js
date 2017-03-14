export default class RegisterController {
    constructor(api, $http, setDirty, $rootScope, $scope, $state) {
        $rootScope.noFooter = true;
        $scope.$on('$destroy', () => {
            $rootScope.noFooter = false;
        });

        self.vm = this;
        self.$rootScope = $rootScope;
        self.api = api;
        self.$http = $http;
        self.$state = $state;
        self.setDirty = setDirty;
        self.vm.isError = false;
        self.vm.user = {
            email: '',
            password: ''
        }
    }

    check(form) {
        if (self.vm.user.email === '') {
            return true
        }
        let url = api('users.check.email', {email: self.vm.user.email})
        $http.get(url)
            .then(function (data) {
                if (data.data.isValid === true) {
                    form.email.$invalid = true
                    form.email.$error.check = true
                    form.email.$dirty = true
                } else {
                    form.email.$error.check = false
                    form.email.$dirty = false
                    form.email.$invalid = false
                }
            })
    }

    register(form) {
        if (form.$invalid) {
            return self.setDirty(form);
        }
        if (self.vm.user.password !== self.vm.user.confirm_password) {
            form.confirm_password.$error.match = true;
            return self.setDirty(form)
        }
        if (form.email.$error.check === true) {
            return self.setDirty(form);
        }
        $http.post(self.api('users.auth.register'), self.vm.user)
            .then(function (data) {
                if (data.data.isValid === true) {
                    $http.post(self.api('users.auth.login'), self.vm.user)
                        .then(function (data) {
                            self.$rootScope.currentUser = data.data.returnValue.currentUser;
                            self.$state.go("home");
                        })
                }
            })
            .catch(function (error) {
                self.vm.isError = true;
            })
    }
}

RegisterController.$inject = ['api', '$http', 'setDirty', "$rootScope", "$scope", "$state"];
