import accModule from '../acc.module';

function journalCreateModalController($scope, $modalInstance, journalApi, logger) {

    $scope.errors = [];
    $scope.journal = {
        temporaryNumber: null,
        temporaryDate: null,
        description: ''
    };

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return;

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        journalApi.create($scope.journal)
            .then((result)=> {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors)=> {
                $scope.errors = errors;
            })
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $modalInstance.dismiss();
}

function journalCreateModalControllerService(modalBase) {
    return modalBase({
        controller: journalCreateModalController,
        templateUrl: 'partials/modals/journalCreate.html'
    });
}

accModule
    .controller('journalCreateModalController', journalCreateModalController)
    .factory('journalCreateModalControllerService', journalCreateModalControllerService);



