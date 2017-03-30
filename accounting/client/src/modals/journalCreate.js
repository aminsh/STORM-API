import accModule from '../acc.module';

function journalCreateModalController($scope, $modalInstance, journalApi, logger, formService) {

    $scope.errors = [];
    $scope.journal = {
        temporaryNumber: null,
        temporaryDate: null,
        description: ''
    };

    $scope.isDefaultNumberAndDate = false;

    $scope.isSaving = false;

    $scope.save = function (form) {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.removeAll();

        $scope.isSaving = true;

        if ($scope.isDefaultNumberAndDate) {
            $scope.journal.temporaryNumber = null;
            $scope.journal.temporaryDate = null;
        }

        journalApi.create($scope.journal)
            .then((result) => {
                logger.success();
                $modalInstance.close(result);
            })
            .catch((errors) => {
                $scope.errors = errors;
            })
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $modalInstance.dismiss();
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



