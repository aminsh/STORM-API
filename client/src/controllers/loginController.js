export default function loginController($scope,userApi, formService, navigate,$window, $location) {
    "use strict";

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
                if (!result.returnUrl) {
                    $scope.$emit('user-login', {currentUser: result.currentUser});
                    return this.returnUrl
                        ? $location.url(this.returnUrl)
                        : navigate('home');
                }

                $window.location.href = result.returnUrl;
            })
            .catch(errors=> {
                debugger;
                this.errors = errors
            });
    };
}