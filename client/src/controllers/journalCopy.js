import accModule from '../acc.module';

function journalCopyController($scope, translate, journalApi, navigate, devConstants, confirm) {
    $scope.errors = [];

    $scope.periodDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.period.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.periodOnChange = (current)=> {
        $scope.gridOption.readUrl = devConstants.urls.journal.getAllByPeriod(current.id);
    };

    $scope.current =false;
    $scope.onCurrentChanged = current => $scope.current = current;

    $scope.gridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '20%', type: 'number'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '20%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '50%',
                template: '<span title="{{item.description}}">{{item.description}}</span>'
            }
        ],
        commands: [],
        selectable: true
    };

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

