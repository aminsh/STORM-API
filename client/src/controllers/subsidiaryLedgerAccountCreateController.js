import accModule from '../acc.module';

function subsidiaryLedgerAccountCreateController($scope, logger, navigate, $routeParams,
                                                 constants, formService,
                                                 subsidiaryLedgerAccountApi,
                                                 dimensionCategoryApi) {

    let generalLedgerAccountId = $routeParams.generalLedgerAccountId;

    $scope.errors = [];
    $scope.assignmentStatus = constants.enums.AssignmentStatus().data;

    $scope.subsidiaryLedgerAccount = {
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