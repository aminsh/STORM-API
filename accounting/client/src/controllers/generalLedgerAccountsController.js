import accModule from "../acc.module";

function generalLedgerAccountsController($scope, $rootScope, logger, translate, confirm, devConstants,
                                         generalLedgerAccountApi,
                                         subsidiaryLedgerAccountApi,
                                         subsidiaryLedgerAccountEntryModalService,
                                         $timeout) {

    $rootScope.$on('onGeneralLedgerAccountChanged', () => fetch());
    $rootScope.$on('onSubsidiaryLedgerAccountChanged', () => fetch());

    function fetch(){
        generalLedgerAccountApi.getChartOfAccounts()
            .then(result => $scope.chartOfAccounts = result);
    }

    fetch();

    $scope.removeGeneralLedgerAccount = current => {
        confirm(
            translate('Remove General ledger account'),
            translate('Are you sure ?'))
            .then(function () {
                generalLedgerAccountApi.remove(current.id)
                    .then(function () {
                        logger.success();
                        $scope.gridOption.refresh();
                    })
                    .catch(errors => {
                        $timeout(() => logger.error(errors.join('<br/>')), 100);
                    })
                    .finally(() => $scope.isSaving = false);
            });
    };

    $scope.removeSubsidiaryLedgerAccount = current => {
        confirm(
            translate('Remove Subsidiary ledger account'),
            translate('Are you sure ?'))
            .then(() => {
                subsidiaryLedgerAccountApi.remove(current.id)
                    .then(() => {
                        logger.success();
                        $scope.gridOptionSubsidiaryLedgerAccount.refresh();
                    })
                    .catch((errors) => {
                        $timeout(() => logger.error(errors.join('<br/>')), 100);
                    });
            });
    };

    $scope.createSubsidiaryLedgerAccount = () => {
        subsidiaryLedgerAccountEntryModalService.show({
            generalLedgerAccount: $scope.current,
            editMode: 'create'
        })
            .then(() => $scope.gridOptionSubsidiaryLedgerAccount.refresh());
    };

    $scope.collapse = (item)=> {
        item.canShow = !item.canShow;

        if(item.canShow) return;

        if(!item.hasOwnProperty('generalLedgerAccounts')) return;

        item.generalLedgerAccounts.forEach(gla => gla.canShow = false);
    }
}

accModule
    .controller('generalLedgerAccountsController', generalLedgerAccountsController);