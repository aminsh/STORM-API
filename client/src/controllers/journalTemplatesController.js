import accModule from '../acc.module';

function journalTemplatesController($scope, translate, confirm, navigate, journalTemplateApi, devConstants, prompt, logger, $timeout) {
    $scope.errors = [];
    $scope.canShowJournalGrid = false;

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

    $scope.periodOnChange = (e)=> {
        let item = e.sender.dataItem();

        $scope.canShowJournalGrid = false;
        $scope.journalGridOption.readUrl = devConstants.urls.journal.getAllByPeriod(item.id);

        $timeout(()=> $scope.canShowJournalGrid = true, 0)
    };

    $scope.gridOption = {
        columns: [
            {
                name: 'title', title: translate('Title'), width: '70%', type: 'string',
                template: '<span title="${data.title}">${data.title}</span>'
            }
        ],
        commands: [
            {
                title: translate('New Journal'),
                action: (current)=> {
                    confirm(
                        translate('Are you sure ?'),
                        translate('New Journal')
                    ).then(()=> {
                        journalTemplateApi.journalCreate(current.id)
                            .then((result)=> {
                                confirm(
                                    translate('Do you want to edit created journal ?'),
                                    translate('Successful'),
                                    'success'
                                ).then(()=> {
                                    navigate('journalUpdate', {id: result.id});
                                });
                            })
                            .catch((errors)=> $scope.errors = errors);
                    })
                }
            }
        ],
        readUrl: devConstants.urls.journalTemplate.getAll()
    };

    $scope.journalGridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '10%', type: 'number'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '20%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '50%',
                template: '<span title="${data.description}">${data.description}</span>'
            }
        ],
        commands: [
            {
                title: translate('Copy to journal template'),
                action: (current)=> {
                    prompt({
                        title: translate('Copy to journal template'),
                        text: translate('Enter Title of journal template'),
                    }).then((inputValue)=> {
                        journalTemplateApi.create(current.id, {title: inputValue})
                            .then(function () {
                                logger.success();
                                $scope.gridOption.refresh();
                            });
                    })
                }
            }
        ]
    };
}

accModule.controller('journalTemplatesController', journalTemplatesController);
