import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

function generalLedgerAccountCreateModalController($scope, $modalInstance, generalLedgerAccountApi, logger, formService) {

    $scope.errors = [];
    $scope.generalLedgerAccount = {
        title: '',
        code: '',
        postingType: null,
        balanceType: null,
        description: ''
    }

    $scope.isSaving = false;
    $scope.save = function (form) {
        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.errors.removeAll();

        $scope.isSaving = true;

        generalLedgerAccountApi.create($scope.generalLedgerAccount)
            .then(function (result) {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = function () {
        $modalInstance.dismiss();
    };

    $scope.accountPostingType = devConstants.enums.AccountPostingType();
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


