import accModule from '../acc.module';

function subsidiaryLedgerAccountUpdateController($scope, logger, navigate, constants,
                                                 $routeParams, formService,
                                                 subsidiaryLedgerAccountApi) {
    let id = $routeParams.id;

    $scope.errors = [];
    $scope.assignmentStatus = new constants.enums.AssignmentStatus().data

    $scope.subsidiaryLedgerAccount = {
        code: '',
        title: '',
        detailAccountAssignmentStatus: null,
        isBankAccount: false,
        dimensionAssignmentStatus: [],
        isActive: true
    };

    subsidiaryLedgerAccountApi.getById(id)
        .then((result)=>
            $scope.subsidiaryLedgerAccount = result);

    $scope.isSaving = false;

    $scope.save = (form)=> {

        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.isSaving = true;

        subsidiaryLedgerAccountApi
            .update(id, $scope.subsidiaryLedgerAccount)
            .then(()=> {
                logger.success();
                navigate('subsidiaryLedgerAccounts', {
                    generalLedgerAccountId: $scope.subsidiaryLedgerAccount.generalLedgerAccountId
                });
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    }

    $scope.isActivating = false;

    $scope.activate = ()=> {
        $scope.isActivating = true;

        subsidiaryLedgerAccountApi.activate(id)
            .then(()=> {
                logger.success();
                $scope.subsidiaryLedgerAccount.isActive = true;
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isActivating = false);
    };


    $scope.isDeactivating = false;

    $scope.deactivate = ()=> {
        $scope.isDeactivating = true;

        subsidiaryLedgerAccountApi.deactivate(id)
            .then(()=> {
                logger.success();
                $scope.subsidiaryLedgerAccount.isActive = false;
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isDeactivating = false);
    };
}

accModule.controller(
    'subsidiaryLedgerAccountUpdateController',
    subsidiaryLedgerAccountUpdateController);