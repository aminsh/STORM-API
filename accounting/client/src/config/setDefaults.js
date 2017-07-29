"use strict";

import io from 'socket.io-client';

export default function ($rootScope,
                         $state,
                         $cookies,
                         branchApi,
                         dimensionCategoryApi) {

    $rootScope.user = JSON.parse(localStorage.getItem('currentUser'));
    $rootScope.today = localStorage.getItem('today');
    $rootScope.fiscalPeriodId = $cookies.get('current-period');
    $rootScope.mode = localStorage.getItem('mode');
    $rootScope.canShowStatusSection = false;
    $rootScope.isDevelopment = localStorage.getItem('env') == 'development';

    //init socket
    let socket = io.connect('/');
    socket.emit('join', $rootScope.user.id);

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            let branchFromCurrent = $rootScope.branch,
                branchIdCookie = $cookies.get('branch-id'),
                fiscalPeriodId = $cookies.get('current-period');

            if (branchFromCurrent == null &&
                branchIdCookie == null) {

                return toState.controller != 'chooseBranchController' &&
                    goToBranchChooser();
            }
            else{
                dimensionCategoryApi.getAll().then(result => {
                    localStorage.setItem('dimensionCategories', JSON.stringify(result.data));
                });
            }

            function goToBranchChooser() {
                event.preventDefault();
                $state.go('chooseBranch');
            }

            if (branchFromCurrent == null &&
                branchIdCookie != null) {

                branchApi.getCurrent()
                    .then(result => $rootScope.branch = result);
            }

        });
}