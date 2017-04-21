export default class RegisterController {
    constructor(userApi, setDirty, $rootScope, $scope, $state) {

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
        }
    }

    check(form) {
        let email = this.user.email;

        if (email === '')
            return true;

        this.userApi.isUniqueEmail(email)
            .then(isValid => {
                if (isValid === true) {
                    form.email.$invalid = true;
                    form.email.$error.check = true;
                    form.email.$dirty = true
                } else {
                    form.email.$error.check = false;
                    form.email.$dirty = false;
                    form.email.$invalid = false
                }
            });

    }

    register(form) {
        let user = this.user;

        if (form.$invalid)
            return this.setDirty(form);

        if (user.password !== user.confirm_password) {
            form.confirm_password.$error.match = true;
            return this.setDirty(form)
        }
        if (form.email.$error.check === true) {
            return this.setDirty(form);
        }

        this.userApi.register(user)
            .then(result => this.$state.go('home'));
    }
}

RegisterController.$inject = [
    'userApi',
    'setDirty',
    '$rootScope',
    '$scope',
    '$state'
];
