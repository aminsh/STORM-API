"use strict";

import io from 'socket.io-client';

export default function ($rootScope,
                         $window,
                         $state,
                         $cookies,
                         $location,
                         branchApi) {

    $rootScope.user = JSON.parse(localStorage.getItem('currentUser'));
    $rootScope.today = localStorage.getItem('today');
    $rootScope.fiscalPeriodId = $cookies.get('current-period');
    $rootScope.mode = localStorage.getItem('mode');
    $rootScope.canShowStatusSection = false;
    $rootScope.isDevelopment = localStorage.getItem('env') === 'development';

    //init socket
    let socket = io.connect('/');
    socket.emit('join', $rootScope.user.id);

    $rootScope.$on('onBranchIsInvalid', () => {
        goToChooseBranchAction();
    });

    $rootScope.$on('onUserIsNotAuthenticated', ()=> $window.location.reload());

    $rootScope.$on('onBranchChanged', (e, branch)=> {
        $rootScope.branch = branch;
        $cookies.put('BRANCH-KEY', branch.token, {path: '/'});
    });

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

            const branchToken = $cookies.get('BRANCH-KEY'),
                branch = $rootScope.branch;

            if (toState.controller === 'branchesController')
                return;

            if (!branchToken)
                return goToChooseBranchAction(event);


            if (!branch) {
                branchApi.getByToken(branchToken)
                    .then(branch => $rootScope.branch = branch)
                    .catch(e => goToChooseBranchAction(event));
            }

        });

    function goToChooseBranchAction(event) {
        $rootScope.branch = undefined;

        event.preventDefault();

        const url = $location.$$url;
        $location.search({returnUrl: url});
        $state.go('branches');
    }
}