import accModule from '../acc.module';

function chequeCategoriesController($scope, logger, chequeCategoryApi, confirm, constants, translate, navigate,
                                    chequeCategoryCreateModalService,
                                    chequeCategoryUpdateModalService) {
    $scope.gridOption = {
        columns: [
            {name: 'bank', title: translate('Bank'), width: '10%', type: 'bank'},
            {name: 'totalPages', title: translate('Total pages'), type: 'number', width: '10%'},
            {name: 'firstPageNumber', title: translate('First page number'), type: 'number', width: '10%'},
            {name: 'lastPageNumber', title: translate('Last page number'), type: 'number', width: '10%'},
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '${data.detailAccountDisplay}'
            },
            {
                name: 'status',
                title: translate('Status'),
                type: 'chequeCategoryStatus',
                template: '${data.statusDisplay}',
                width: '10%'
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                action: function (current) {
                    chequeCategoryUpdateModalService.show({id: current.id})
                        .then(()=> {
                            logger.success();
                            $scope.gridOption.refresh();
                        });
                }
            },
            {
                title: translate('Remove'),
                action: function (current) {
                    confirm(
                        translate('Remove Cheque category'),
                        translate('Are you sure ?'))
                        .then(()=> {
                            chequeCategoryApi.remove(current.id)
                                .then(function () {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch((errors)=> $scope.errors = errors)
                                .finally(()=> $scope.isSaving = false);
                        })

                }
            }
        ],
        readUrl: constants.urls.chequeCategory.all()
    };

    $scope.create = ()=> {
        chequeCategoryCreateModalService.show()
            .then(()=> {
                logger.success();
                $scope.gridOption.refresh();
            });
    }
}

accModule.controller('chequeCategoriesController', chequeCategoriesController);
