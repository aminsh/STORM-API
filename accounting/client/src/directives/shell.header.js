export default function (fiscalPeriodApi, $rootScope, $cookies, logger, branchApi) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/shell.header-template.html',
        replace: true,
        link: (scope, element, attrs) => {
            scope.fiscalPeriods = [];

            scope.toggleSidebar = () => scope.$emit('toggle-sidebar');

            $rootScope.$on('onBranchChanged', (e, branch) => {
                if (branch)
                    fetchFiscalPeriod();
            });

            if ($cookies.get('current-period'))
                fetchFiscalPeriod();

            function fetchFiscalPeriod() {
                fiscalPeriodApi.getAll().then(result => {
                    scope.fiscalPeriods = result.data;
                    scope.selectFiscalPeriod(scope.fiscalPeriods[0]);
                });
            }

            scope.selectFiscalPeriod = current => {
                $rootScope.fiscalPeriodId = current.id;
                $cookies.put('current-period', current.id, {path: '/'});
                scope.$broadcast('fiscal-period-changed');
            };

            /*scope.showApiKey = () => {
                branchApi.getApiKey()
                    .then(result => logger.alert({
                        title: 'api-key',
                        text: `<textarea 
                                    disabled="true" 
                                    style="font-family: Arial;width: 100%;height: 171px;direction: ltr">${result.apiKey}</textarea>`,
                        html: true
                    }));
            };*/

            branchApi.getMyBranches().then(result => {
                scope.branches = result;
            });

            scope.selectBranch = branch =>  $rootScope.$broadcast('onBranchChanged', branch);
        }
    }
}

