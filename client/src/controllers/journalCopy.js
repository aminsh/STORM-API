import accModule from '../acc.module';

function journalCopyController($scope, translate, journalApi, navigate, constants, $timeout, confirm) {
    "use strict";

    $scope.errors = [];

    $scope.periodDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.period.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.periodOnChange = (e)=> {
        let item = e.sender.dataItem();

        $scope.canShowJournalGrid = false;
        $scope.gridOption.readUrl = constants.urls.journal.getAllByPeriod(item.id);

        $timeout(()=> $scope.canShowJournalGrid = true, 0)
    };

    $scope.gridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '20%', type: 'number'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '20%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '50%',
                template: '<span title="${data.description}">${data.description}</span>'
            }
        ],
        commands: [],
        selectable: true,
        current: null
    };

    $scope.canShowJournalGrid = false;

    $scope.isSaving = false;

    $scope.submit = (current)=> {

        confirm(
            translate('Are you sure ?'),
            translate('Copy journal')
        ).then(()=> {
            $scope.isSaving = true;

            journalApi.copy(current.id)
                .then((result)=> {
                    confirm(
                        translate('Do you want to edit created journal ?'),
                        translate('Successful'),
                        'success'
                    ).then(()=> {
                        navigate('journalUpdate', {id: result.id});
                    });
                })
                .finally(()=> $scope.isSaving = false)
        });
    };

    $scope.editCreatedJournal = ()=> {
        navigate('journalUpdate', {id: $scope.model.createdJournalId});
    };
}

accModule
    .controller('journalCopyController', journalCopyController);

