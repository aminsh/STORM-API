export default function loginController($scope, userApi, formService, navigate, $window, $location, $routeParams) {
    "use strict";

    this.isAuth = $routeParams.isAuth;
    this.errors = [];

    this.loginModel = {
        email: '',
        password: ''
    };

    this.returnUrl = $location.search()
        ? $location.search().returnUrl
        : null;

    this.login = (form)=> {
        if (form.$invalid)
            return formService.setDirty(form);

        userApi.login(this.loginModel)
            .then(result=> {
                $scope.$emit('user-login', {currentUser: result.currentUser});

                if (!(result.returnUrl || this.isAuth)) {
                    return this.returnUrl
                        ? $location.url(this.returnUrl)
                        : navigate('home');
                }

                if (result.returnUrl)
                    $window.location.href = result.returnUrl;

                navigate('branchChoose', {isAuth: 'auth'});
            })
            .catch(errors=> {
                debugger;
                this.errors = errors
            });
    };
}