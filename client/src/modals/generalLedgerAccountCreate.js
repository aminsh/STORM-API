import accModule from '../acc.module';
import constants from '../localData/constants';
import Collection from 'dev.collection';

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

        Collection.removeAll($scope.errors);

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

    $scope.accountPostingType = constants.enums.AccountPostingType();
    $scope.accountBalanceType = constants.enums.AccountBalanceType();
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



