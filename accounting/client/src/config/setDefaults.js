"use strict";

export default function ($rootScope,
                         $state,
                         $cookies,
                         branchApi) {

    $rootScope.user = JSON.parse(localStorage.getItem('currentUser'));
    $rootScope.today = localStorage.getItem('today');
    $rootScope.fiscalPeriodId = $cookies.get('current-period');
    $rootScope.mode = localStorage.getItem('mode');
    $rootScope.canShowStatusSection = false;
    $rootScope.isDevelopment = localStorage.getItem('env') == 'development';

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

            function goToBranchChooser() {
                event.preventDefault();
                $state.go('chooseBranch');
            }

            if (branchFromCurrent == null &&
                branchIdCookie != null) {

                branchApi.getCurrent().then(result => $rootScope.branch = result);

                return;
            }

            if (fiscalPeriodId == null)
                return toState.controller != 'createFiscalPeriodController'
                    && $state.go('fiscal-period.new');
            else
                $rootScope.fiscalPeriodId = fiscalPeriodId;

        });
}