"use strict";

export default function ($rootScope, $location, $state) {
    let locationSearch = false;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            if (toState.shouldAuthenticate && !$rootScope.isAuthenticated) {
                event.preventDefault();
                $location.search({returnUrl: $location.$$url});
                $state.go('login');
            }
        });

    $rootScope.$on('$stateChangeStart', () => locationSearch = $location.search());
    $rootScope.$on('$stateChangeSuccess', () => $location.search(locationSearch));
}