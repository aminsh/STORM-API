import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

function generalLedgerAccountCreateModalController($scope, $rootScope ,$uibModalInstance, generalLedgerAccountApi, logger, formService) {

    $scope.errors = [];
    $scope.generalLedgerAccount = {
        title: '',
        code: '',
        postingType: null,
        groupingType:null,
        balanceType: null,
        description: ''
    };

    $scope.isSaving = false;
    $scope.save = function (form) {
        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        generalLedgerAccountApi.create($scope.generalLedgerAccount)
            .then(function (result) {
                logger.success();
                $uibModalInstance.close(result);
                $rootScope.$emit('onGeneralLedgerAccountChanged');
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };

    $scope.accountPostingType = devConstants.enums.AccountPostingType();
    $scope.accountGroupingType = devConstants.enums.AccountGroupingType();
    $scope.accountBalanceType = devConstants.enums.AccountBalanceType();
}

function generalLedgerAccountCreateModalService(modalBase) {
    return modalBase({
        controller: generalLedgerAccountCreateModalController,
        templateUrl: 'partials/modals/generalLedgerAccountCreate.html'
    });
}

accModule
    .controller('generalLedgerAccountCreateModalController', generalLedgerAccountCreateModalController)
    .factory('generalLedgerAccountCreateModalService', generalLedgerAccountCreateModalService);



