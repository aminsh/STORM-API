import accModule from '../acc.module';

function detailAccountCreateController($scope, logger, navigate, formService,
                                       detailAccountApi) {

    $scope.errors = [];

    $scope.detailAccount = {
        code: '',
        title: '',
        description: ''
    };

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();
        $scope.isSaving = true;

        detailAccountApi.create($scope.detailAccount)
            .then(()=> {
                logger.success();
                navigate('detailAccounts');
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

};

accModule.controller('detailAccountCreateController', detailAccountCreateController);