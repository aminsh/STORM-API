export default function homeController($scope, branchStateService, authService) {
    "use strict";

    this.branch = branchStateService.get();
    this.isAuth = authService.isAuth();

    $scope.$on('login-changed', ()=> this.isAuth = authService.isAuth());
    $scope.$on('branch-changed', ()=> this.branch = branchStateService.get());
}