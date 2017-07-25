import accModule from "../acc.module";

function generalLedgerAccountsController($scope, $rootScope, logger, translate, confirm, devConstants,
                                         generalLedgerAccountApi,
                                         subsidiaryLedgerAccountApi,
                                         subsidiaryLedgerAccountEntryModalService,
                                         $timeout) {

    $rootScope.$on('onGeneralLedgerAccountChanged', () => $scope.gridOption.refresh());
    $rootScope.$on('onSubsidiaryLedgerAccountChanged', () => $scope.gridOptionSubsidiaryLedgerAccount.refresh());

    let columns = [
            {
                name: 'isLocked',
                title: '',
                width: '50px',
                filterable: false,
                template: '<i ng-if="item.isLocked" class="fa fa-lock fa-lg"></i>'
            },
            {
                name: 'code',
                title: translate('Code'),
                width: '120px',
                type: 'string'
            },
            {
                name: 'title',
                title: translate('Title'),
                type: 'string',
                template: `<a ui-sref=".edit({id: item.id})">{{item.title}}</a>`
            },
            {
                name: 'groupingType',
                title: translate('Grouping type'),
                type: 'groupingType',
                width: '150px',
                template: '{{item.groupingTypeDisplay}}'
            },
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
            }
        ],
        commands = [
            {
                title: translate('Remove'),
                icon: 'fa fa-trash text-danger',
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
                                .catch(errors => {
                                    $timeout(() => logger.error(errors.join('<br/>')), 100);
                                })
                                .finally(() => $scope.isSaving = false);
                        })

                }
            }
        ];

    $scope.current = false;
    $scope.gridOption = {
        columns: columns,
        commands: commands,
        readUrl: devConstants.urls.generalLedgerAccount.all(),
        selectable: true,
        gridSize: '300px'
    };

    $scope.selectGeneralLedgerAccount = current => {
        $scope.gridOptionSubsidiaryLedgerAccount.readUrl =
            devConstants.urls.subsidiaryLedgerAccount.allByGeneralLedgerAccount(current.id);
        $scope.current = current;
    };

    $scope.gridOptionSubsidiaryLedgerAccount = {
        columns: [
            {
                name: 'isLocked',
                title: '',
                width: '50px',
                filterable: false,
                template: '<i ng-if="item.isLocked" class="fa fa-lock fa-lg"></i>'
            },
            {name: 'code', title: translate('Code'), type: 'string'},
            {
                name: 'title',
                title: translate('Title'),
                type: 'string',
                width: '40%',
                template: `<a ui-sref=".subsidiary-ledger-accounts.edit({id: item.id})">{{item.title}}</a>`
            }
        ],
        commands: [
            {
                title: translate('Remove'),
                icon: 'fa fa-trash text-danger',
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
                                .catch((errors) => {
                                    $timeout(() => logger.error(errors.join('<br/>')), 100);
                                });
                        });

                }
            }
        ],
        readUrl: '',
        gridSize: '200px',
        init: (current, option) => option.readUrl = subsidiaryLedgerAccountApi.url.getAll(current.id)
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