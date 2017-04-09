import accModule from '../acc.module';

function subsidiaryLedgerAccountCreateController($scope, logger, navigate, $stateParams,
                                                 devConstants, formService,
                                                 subsidiaryLedgerAccountApi,
                                                 dimensionCategoryApi) {

    let generalLedgerAccountId = $stateParams.generalLedgerAccountId;

    $scope.errors = [];
    $scope.assignmentStatus = devConstants.enums.AssignmentStatus().data;

    $scope.subsidiaryLedgerAccount = {
        generalLedgerAccountId: generalLedgerAccountId,
        code: '',
        title: '',
        detailAccountAssignmentStatus: null,
        isBankAccount: false,
        dimension1AssignmentStatus: null,
        dimension2AssignmentStatus: null,
        dimension3AssignmentStatus: null,
    };

    $scope.dimensionCategories = [];

    dimensionCategoryApi.getAll()
        .then((result)=> {
            $scope.dimensionCategories = result.data;
        });

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.isSaving = true;

        subsidiaryLedgerAccountApi.create(
            generalLedgerAccountId,
            $scope.subsidiaryLedgerAccount)
            .then(() => {
                logger.success();
                navigate(
                    'subsidiaryLedgerAccounts',
                    {generalLedgerAccountId: generalLedgerAccountId});
            }).catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    }
}

accModule
    .controller('subsidiaryLedgerAccountCreateController', subsidiaryLedgerAccountCreateController);