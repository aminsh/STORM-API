import accModule from '../acc.module';

function subsidiaryLedgerAccountsController($scope, logger, confirm, navigate, $routeParams, translate,
                                            subsidiaryLedgerAccountApi) {

    let generalLedgerAccountId = $routeParams.generalLedgerAccountId;

    $scope.gridOption = {
        columns: [
            {name: 'code', title: translate('Code'), width: '200px', type: 'string'},
            {name: 'title', title: translate('Title'), type: 'string'},
            {
                name: 'isActive',
                title: translate('Is active ?'),
                type: 'activeType',
                width: '170px',
                template: '<i class="glyphicon glyphicon-${data.isActive ? "ok-circle" : "remove-circle"}"' +
                'style="font-size: 20px;color:${data.isActive ? "green" : "red"}">' +
                '</i>'
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                name: 'editSubsidiaryLedgerAccount',
                action: (current) => {
                    navigate('subsidiaryLedgerAccountUpdate', {
                        id: current.id
                    });
                }
            },
            {
                title: translate('Remove'),
                action: (current) => {
                    confirm(
                        translate('Remove Subsidiary ledger account'),
                        translate('Are you sure ?'))
                        .then(()=> {
                            subsidiaryLedgerAccountApi.remove(current.id)
                                .then(()=> {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch((errors)=> $scope.errors = errors);
                        });

                }
            }
        ],
        readUrl: subsidiaryLedgerAccountApi.url.getAll(generalLedgerAccountId)
    };

    $scope.create = ()=> {
        navigate('subsidiaryLedgerAccountCreate', {
            generalLedgerAccountId: generalLedgerAccountId
        });
    }
}

accModule
    .controller('subsidiaryLedgerAccountsController', subsidiaryLedgerAccountsController);