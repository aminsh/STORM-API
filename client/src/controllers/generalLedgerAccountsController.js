import accModule from '../acc.module';

function generalLedgerAccountsController($scope, logger, translate, confirm,
                                         generalLedgerAccountApi,
                                         generalLedgerAccountCreateModalService,
                                         generalLedgerAccountUpdateModalService) {
    let columns = [
        {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
        {name: 'title', title: translate('Title'), type: 'string'},
        {
            name: 'postingType',
            title: translate('Posting type'),
            type: 'postingType',
            width: '150px',
            template: '${data.postingTypeDisplay}'
        },
        {
            name: 'balanceType',
            title: translate('Balance type'),
            type: 'balanceType',
            width: '150px',
            template: '${data.balanceTypeDisplay}'
        },
        {
            name: 'isActive',
            title: translate('Is active ?'),
            type: 'activeType',
            width: '150px',
            template: '<i class="glyphicon glyphicon-${data.isActive ? "ok-circle" : "remove-circle"}"' +
            'style="font-size: 20px;color:${data.isActive ? "green" : "red"}">' +
            '</i>'
        }
    ];

    let commands = [
        {
            title: translate('Edit'),
            name: 'edit general ledger account',
            action: function (current) {
                generalLedgerAccountUpdateModalService.show({id: current.id})
                    .then(function () {
                        $scope.gridOption.refresh();
                    });
            }
        },
        {
            title: translate('Remove'),
            action: function (current) {
                confirm(
                    translate('Remove General ledger account'),
                    translate('Are you sure ?'))
                    .then(function () {
                        generalLedgerAccountApi.remove(current.id)
                            .then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            })
                            .catch((errors)=> $scope.errors = errors)
                            .finally(()=> $scope.isSaving = false);
                    })

            }
        }
    ];

    $scope.gridOption = {
        columns: columns,
        commands: commands,
        readUrl: generalLedgerAccountApi.url.getAll,
        current: null,
        selectable: true
    };

    $scope.create = function () {
        generalLedgerAccountCreateModalService.show()
            .then(function () {
                $scope.gridOption.refresh();
            });
    };
}

accModule
    .controller('generalLedgerAccountsController', generalLedgerAccountsController);