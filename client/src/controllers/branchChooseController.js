export default function branchChooseController($scope, branchApi, userApi, $cookies, navigate, $routeParams, $window) {
    "use strict";

    this.isAuth = $routeParams.isAuth;
    this.branches = [];
    this.selectedBranch = {};

    branchApi.my().then(result=> this.branches = result);

    this.select = branch => {
        this.selectedBranch = branch;
        $cookies.put('branch-id', branch.id);
        $scope.$emit('branch-changed', branch);

        if (this.isAuth)
            return userApi.getAuthReturnUrl()
                .then(returnUrl=> {
                    debugger;
                    $window.location.href = returnUrl});

        navigate('home');
    };
}