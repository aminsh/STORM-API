import accModule from '../acc.module';

function chequeCategoriesController($scope, logger, chequeCategoryApi, confirm, devConstants, translate, $state,
                                    writeCheque) {
    $scope.currentCategory = false;

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
            },
            {
                name: 'status',
                title: translate('Status'),
                type: 'number',
                width: '10%',
                template: '{{item.statusDisplay}}'
            }
        ],
        commands: [{
            title: translate('Create cheque'),
            icon: 'fa fa-edit',
            action: current => writeCheque.show({
                detailAccountId:$scope.currentCategory.detailAccountId,
                detailAccountDisplay: $scope.currentCategory.detailAccount,
                chequeId: current.id,
                chequeNumber: current.number
            }),
            canShow: item => item.status != 'Used'
        }],
        gridSize: '200px',
        readUrl: ''
    };

    $scope.onSelectCategory = current => {
        $scope.currentCategory = current;
        $scope.chequeGridOption.readUrl = devConstants.urls.cheque.all(current.id);
    };


}

accModule.controller('chequeCategoriesController', chequeCategoriesController);
