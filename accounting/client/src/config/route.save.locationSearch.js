"use strict";

export default function ($rootScope, $location) {
    let locationSearch = false;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            locationSearch = $location.search();
        });

    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {

            $location.search(locationSearch);
        });
}