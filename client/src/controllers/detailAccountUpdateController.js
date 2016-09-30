import accModule from '../acc.module';

function detailAccountUpdateController($scope, logger, navigate, $routeParams,
                                       detailAccountApi) {

    let id = $routeParams.id;

    $scope.errors = [];

    $scope.detailAccount = {
        code: '',
        title: '',
        description: ''
    };

    $scope.isSaving = false;

    detailAccountApi.getById(id)
        .then(result => $scope.detailAccount = result);

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid)
            return;
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

    $scope.activate = ()=> {
        detailAccountApi.activate(id)
            .then(()=> {
                $scope.detailAccount.isActive = true;
                logger.success();
            })
            .catch((errors)=> $scope.errors = errors);
    }

    $scope.deactivate = ()=> {
        detailAccountApi.deactivate(id)
            .then(()=> {
                $scope.detailAccount.isActive = false;
                logger.success();
            })
            .catch((errors)=> $scope.errors = errors);
    }

};

accModule.controller('detailAccountUpdateController', detailAccountUpdateController);