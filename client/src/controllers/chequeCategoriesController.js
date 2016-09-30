import accModule from '../acc.module';

function chequeCategoriesController($scope, logger, chequeCategoryApi, confirm, constants, translate, $timeout,
                                    chequeCategoryCreateModalService,
                                    chequeCategoryUpdateModalService) {
    $scope.gridOption = {
        columns: [
            {name: 'bankId', title: translate('Bank'), width: '10%', type: 'bank', template: '${data.bank}'},
            {name: 'totalPages', title: translate('Total pages'), type: 'number', width: '10%'},
            {name: 'firstPageNumber', title: translate('First page number'), type: 'number', width: '10%'},
            {name: 'lastPageNumber', title: translate('Last page number'), type: 'number', width: '10%'},
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '${data.detailAccount}'
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
        readUrl: constants.urls.chequeCategory.all(),
        current: null,
        selectable: true
    };

    $scope.chequeGridOption = {
        columns: [
            {name: 'number', title: translate('Number'), width: '10%', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '10%'},
            {name: 'description', title: translate('Description'), type: 'string', width: '30%'},
            {name: 'amount', title: translate('Amount'), type: 'number', width: '10%', format: '{0:#,##}'}
        ],
        commands: [],
        //filterable: false
    };
    $scope.canShowCheques = false;

    $scope.$watch('gridOption.current', (newValue)=> {
        if (!newValue)
            return $scope.canShowCheques = false;

        $scope.canShowCheques = false;

        $timeout(()=> {
            $scope.chequeGridOption.readUrl = constants.urls.cheque.all(newValue.id);

            $scope.canShowCheques = true;
        }, 500);

    });

    $scope.create = ()=> {
        chequeCategoryCreateModalService.show()
            .then(()=> {
                logger.success();
                $scope.gridOption.refresh();
            });
    }
}

accModule.controller('chequeCategoriesController', chequeCategoriesController);
