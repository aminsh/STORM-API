import accModule from '../acc.module';

function journalAttachImageController($scope, $uibModalInstance) {

    $scope.uploaded = fileName=> {
        $uibModalInstance.close(fileName)
    };

    $scope.close = () => $uibModalInstance.dismiss();
}

function journalAttachImageService(modalBase) {
    return modalBase({
        controller: journalAttachImageController,
        templateUrl: 'partials/modals/journalAttachImage.html'
    });
}

accModule
    .controller('journalAttachImageController', journalAttachImageController)
    .factory('journalAttachImageService', journalAttachImageService);
