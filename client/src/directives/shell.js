export default function shell(userApi, authService, branchStateService,$route) {
    "use strict";

    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.html',
        link: (scope, element, attrs) => {
            let currnetUser = localStorage.getItem('currentUser');
            let currentBranch = JSON.parse(localStorage.getItem('currentBranch'));

            scope.currentBranch = currentBranch || false;
            branchStateService.set(scope.currentBranch);


            if (currnetUser && currnetUser != '') {
                scope.isAuth = true;
                scope.currentUser = currnetUser;
                authService.setUser(currnetUser)
            } else {
                scope.isAuth = false;
                scope.currentUser = '';
            }

            scope.$on('user-logout', logoutOnLocal);

            scope.$on('user-login', (e, data)=> {
                scope.isAuth = true;
                scope.currentUser = data.currentUser;
                authService.setUser(data.currentUser);

                scope.$broadcast('login-changed');

                if (!scope.$$phase)
                    scope.$apply();
            });

            scope.$on('branch-changed', (e, branch)=> {
                scope.currentBranch = branch;
                branchStateService.set(branch);

            });

            scope.logout = ()=> {
                userApi.logout().then(logoutOnLocal);
            };

            function logoutOnLocal() {
                scope.isAuth = false;
                scope.currentUser = '';
                authService.setUser(null);

                scope.$broadcast('login-changed');

                let currentRoute = $route.current;
                if (currentRoute.$$route.data.requireAuth)
                    $route.reload();

                if (!scope.$$phase)
                    scope.$apply();
            }

        }
    }
}