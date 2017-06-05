import accModule from '../acc.module';

function journalManagementController($scope, logger, confirm, devConstants, translate, $timeout,
                                     showJournalDetailModalService) {
    $scope.gridOption = {
        columns: [
            {name: 'monthName', title: translate('Month'), type: 'string'},
            {name: 'count', title: translate('Count'), type: 'string'},
            {name: 'minNumber', title: translate('From number'), type: 'string'},
            {name: 'maxNumber', title: translate('To number'), type: 'string'},
            {name: 'minDate', title: translate('From date'), type: 'string'},
            {name: 'maxDate', title: translate('To date'), type: 'string'}
        ],
        commands: [],
        readUrl: devConstants.urls.journal.getGroupedByMouth(),
        current: null,
        selectable: true,
        filterable: false,
        sortable: false,
        pageable: false,
        gridSize: '200px'
    };

    $scope.canShowJournals = false;

    $scope.journalGridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Temporary number'), type: 'number', width: '10%'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '10%'},
           /* {name: 'number', title: translate('Number'), type: 'number', width: '10%'},
            {name: 'date', title: translate('Date'), type: 'date', width: '10%'},*/
            {
                name: 'isFixed', title: translate('Fixed ?'), type: 'boolean', width: '10%',
                template: '<i class="fa fa-lock" ng-if="item.isFixed"></i>'
            },
            {name: 'sumAmount', title: translate('Amount'), type: 'number', width: '10%', template: '{{item.sumAmount|number}}'},
            {
                name: 'hasAttachment', title: translate('Attachment ?'), type: 'boolean', width: '10%',
                template: '<i class="fa fa-paperclip" ng-if="item.hasAttachment"></i>'
            },
            {name: 'countOfRows', title: translate('Rows'), type: 'number', width: '10%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '20%',
                template: '<span  title="{{item.description}}">{{item.description}}</span>'
            }
        ],
        commands: [],
        selectable: true,
        readUrl: '',
        gridSize: '200px',
        sort: [
            {dir: 'desc', field: 'temporaryNumber'}
        ]
    };

    $scope.current = false;

    $scope.onSelectMonth = current => {
        $scope.current = current;
        $scope.journalGridOption.readUrl = devConstants.urls.journal.getByMonth(current.month);
    };

    $scope.currentJournal= false;

    $scope.onSelectJournal = current => {
        $scope.currentJournal = current;
    };

    $scope.showJournal = ()=> {
        let current = $scope.currentJournal;

        showJournalDetailModalService
            .show({
                id: current.id
            });
    };
}

accModule.controller('journalManagementController', journalManagementController);
