import accModule from '../acc.module';

function generalLedgerAccountsController($scope, logger, translate, confirm,
                                         generalLedgerAccountApi,
                                         subsidiaryLedgerAccountApi,
                                         subsidiaryLedgerAccountEntryModalService,
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
            template: '{{item.postingTypeDisplay}}'
        },
        {
            name: 'balanceType',
            title: translate('Balance type'),
            type: 'balanceType',
            width: '150px',
            template: '{{item.balanceTypeDisplay}}'
        },
        {
            name: 'isActive',
            title: translate('Is active ?'),
            type: 'activeType',
            width: '150px',
            template: `<i class="fa"
                          ng-class="{'fa-check text-navy': item.isActive,
                                     'fa-times text-danger': !item.isActive}">
                       </i>`
        }
    ];

    let commands = [
        {
            title: translate('Edit'),
            name: 'edit general ledger account',
            icon: 'fa fa-edit',
            action: function (current) {
                generalLedgerAccountUpdateModalService.show({id: current.id})
                    .then(function () {
                        $scope.gridOption.refresh();
                    });
            }
        },
        {
            title: translate('Remove'),
            icon: 'fa fa-trash',
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
                            .catch((errors) => $scope.errors = errors)
                            .finally(() => $scope.isSaving = false);
                    })

            }
        }
    ];

    $scope.current = false;

    $scope.gridOption = {
        columns: columns,
        commands: commands,
        readUrl: generalLedgerAccountApi.url.getAll,
        selectable: true,
        gridSize: '200px'
    };

    $scope.selectGeneralLedgerAccount = current => {
        $scope.gridOptionSubsidiaryLedgerAccount.readUrl =
            subsidiaryLedgerAccountApi.url.getAll(current.id);
        $scope.current = current;
    };

    $scope.createGeneralLedgerAccount = function () {
        generalLedgerAccountCreateModalService.show()
            .then(function () {
                $scope.gridOption.refresh();
            });
    };

    $scope.gridOptionSubsidiaryLedgerAccount = {
        columns: [
            {name: 'code', title: translate('Code'), type: 'string'},
            {name: 'title', title: translate('Title'), type: 'string', width: '40%'},
            {
                name: 'isActive',
                title: translate('Is active ?'),
                type: 'activeType',
                template: `<i class="fa"
                          ng-class="{'fa-check text-navy': item.isActive,
                                     'fa-times text-danger': !item.isActive}">
                       </i>`
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                name: 'editSubsidiaryLedgerAccount',
                icon: 'fa fa-edit',
                action: current => {
                    subsidiaryLedgerAccountEntryModalService.show({
                        generalLedgerAccount: $scope.current,
                        subsidiaryLedgerAccountId: current.id,
                        editMode: 'edit'
                    })
                        .then(() => $scope.gridOptionSubsidiaryLedgerAccount.refresh());
                }
            },
            {
                title: translate('Remove'),
                icon: 'fa fa-trash',
                action: (current) => {
                    confirm(
                        translate('Remove Subsidiary ledger account'),
                        translate('Are you sure ?'))
                        .then(() => {
                            subsidiaryLedgerAccountApi.remove(current.id)
                                .then(() => {
                                    logger.success();
                                    $scope.gridOptionSubsidiaryLedgerAccount.refresh();
                                })
                                .catch((errors) => $scope.errors = errors);
                        });

                }
            }
        ],
        readUrl: '',
        gridSize: '200px'
    };

    $scope.createSubsidiaryLedgerAccount = () => {
        subsidiaryLedgerAccountEntryModalService.show({
            generalLedgerAccount: $scope.current,
            editMode: 'create'
        })
            .then(() => $scope.gridOptionSubsidiaryLedgerAccount.refresh());
    };
}

accModule
    .controller('generalLedgerAccountsController', generalLedgerAccountsController);