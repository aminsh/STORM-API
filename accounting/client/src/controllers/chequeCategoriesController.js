import accModule from '../acc.module';

function chequeCategoriesController($scope, logger, chequeCategoryApi, confirm, devConstants, translate, navigate,$state,
                                    chequeCategoryCreateModalService,
                                    chequeCategoryUpdateModalService) {
    $scope.gridOption = {
        columns: [
            {name: 'bankId', title: translate('Bank'), width: '20%', type: 'bank', template: '{{item.bank}}'},
            {name: 'totalPages', title: translate('Total pages'), type: 'number', width: '120px'},
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '{{item.detailAccount}}'
            },
            {
                name: 'status',
                title: translate('Status'),
                type: 'chequeCategoryStatus',
                template: '{{item.statusDisplay}}',
                width: '10%'
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                icon: 'fa fa-edit',
                action: current => $state.go('.edit', {id: current.id})
            },
            {
                title: translate('Remove'),
                icon: 'fa fa-trash',
                action: function (current) {
                    confirm(
                        translate('Remove Cheque category'),
                        translate('Are you sure ?'))
                        .then(() => {
                            chequeCategoryApi.remove(current.id)
                                .then(function () {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch(errors => logger.error(errors.join('<br/>')));
                        })

                }
            }
        ],
        readUrl: devConstants.urls.chequeCategory.all(),
        selectable: true,
        gridSize: '200px'
    };

    $scope.chequeGridOption = {
        columns: [
            {name: 'number', title: translate('Number'), width: '10%', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '10%'},
            {name: 'description', title: translate('Description'), type: 'string', width: '30%'},
            {
                name: 'amount',
                title: translate('Amount'),
                type: 'number',
                width: '10%',
                format: '{0:#,##}',
                template: '{{item.amount|number}}'
            }
        ],
        commands: [{
            title: translate('Print'),
            icon: 'fa fa-print',
            action: current => navigate('chequePrint', {id: current.id})
        }],
        gridSize: '200px',
        readUrl: ''
    };

    $scope.onSelectCategory = current => {
        $scope.chequeGridOption.readUrl = devConstants.urls.cheque.all(current.id);
    };

    $scope.create = () => {
        chequeCategoryCreateModalService.show()
            .then(() => {
                logger.success();
                $scope.gridOption.refresh();
            });
    }
}

accModule.controller('chequeCategoriesController', chequeCategoriesController);
