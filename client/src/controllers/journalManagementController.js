import accModule from '../acc.module';

function journalManagementController($scope, logger, confirm, devConstants, translate, $timeout,
                                     showJournalDetailModalService,
                                     journalBookkeepingService) {
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
        pageable: false,
        gridSize: '300px'
    };

    $scope.canShowJournals = false;

    $scope.journalGridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Temporary number'), type: 'number', width: '10%'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '10%'},
            {name: 'number', title: translate('Number'), type: 'number', width: '10%'},
            {name: 'date', title: translate('Date'), type: 'date', width: '10%'},
            {
                name: 'isFixed', title: translate('Fixed ?'), type: 'boolean', width: '10%',
                template: '<i class="glyphicon glyphicon-${data.isFixed ? "ok-circle" : "remove-circle"}"' +
                'style="font-size: 20px;">' +
                '</i>'
            },
            {name: 'sumAmount', title: translate('Amount'), type: 'number', width: '10%', format: '{0:#,##}'},
            {
                name: 'hasAttachment', title: translate('Attachment ?'), type: 'boolean', width: '10%',
                template: '<i class="glyphicon glyphicon-${data.hasAttachment ? "ok-circle" : "remove-circle"}"' +
                'style="font-size: 20px;">' +
                '</i>'
            },
            {name: 'countOfRows', title: translate('Rows'), type: 'number', width: '10%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '20%',
                template: '<span title="${data.description}">${data.description}</span>'
            },
        ],
        commands: [],
        selectable: true,
        current: null
        //readUrl: devConstants.urls.journal.getByMonth()
    }

    $scope.$watch('gridOption.current', (newValue)=> {
        if (!newValue) return;
        $scope.canShowJournals = false;
        $scope.journalGridOption.readUrl = devConstants.urls.journal.getByMonth(newValue.month);
        $timeout(()=> $scope.canShowJournals = true, 0);
    });

    $scope.bookkeeping = (current)=> {
        if (current.number)
            return logger.error(translate('This journal already bookkeeped'));

        journalBookkeepingService.show({id: current.id})
            .then(()=> {
                logger.success();
                $scope.journalGridOption.refresh();
            });
    };

    $scope.showJournal = (current)=> {
        showJournalDetailModalService
            .show({
                id: current.id
            });
    };
}

accModule.controller('journalManagementController', journalManagementController);
