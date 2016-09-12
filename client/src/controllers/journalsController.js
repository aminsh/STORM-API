import accModule from '../acc.module';

function journalsController($scope, translate, journalApi, navigate, logger,
                            journalCreateModalControllerService) {

    $scope.gridOption = {
        columns: [
            {name: 'number', title: translate('Number'), width: '120px', type: 'string'},
            {name: 'date', title: translate('Date'), type: 'date'},
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '120px', type: 'string'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date'},
            {
                name: 'journalStatus',
                title: translate('Journal status'),
                type: 'journalStatus',
                template: '${data.journalStatusDisplay}'
            },
            {name: 'sumDebtor', title: translate('sum debtor'), type: 'number', format: '{0:#,##}', filterable: false},
            {
                name: 'sumCreditor',
                title: translate('sum creditor'),
                type: 'number',
                format: '{0:#,##}',
                filterable: false
            },
        ],
        commands: [
            {
                title: translate('Edit'),
                action: function (current) {
                    navigate('journalUpdate', {
                        id: current.id
                    });
                }
            }
        ],
        readUrl: journalApi.url.getAll
    };

    $scope.create = ()=> {
        journalCreateModalControllerService.show()
            .then((result)=> {
                logger.success();
                navigate('journalUpdate', {
                    id: result.id
                });
            });
    }


}

accModule.controller('journalsController', journalsController);