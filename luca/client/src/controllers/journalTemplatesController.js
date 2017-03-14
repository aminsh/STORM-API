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

    $scope.periodOnChange = (current)=> {
        $scope.journalGridOption.readUrl = devConstants.urls.journal.getAllByPeriod(current.id);
    };

    $scope.gridOption = {
        columns: [
            {
                name: 'title', title: translate('Title'), width: '70%', type: 'string',
                template: '<span title="{{item.title}}">{{item.title}}</span>'
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
        readUrl: devConstants.urls.journalTemplate.getAll(),
        gridSize: '200px'
    };

    $scope.journalGridOption = {
        columns: [
            {name: 'temporaryNumber', title: translate('Number'), width: '10%', type: 'number'},
            {name: 'temporaryDate', title: translate('Date'), type: 'date', width: '20%'},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '50%',
                template: '<span title="{{item.description}}">{{item.description}}</span>'
            }
        ],
        commands: [
            {
                title: translate('Copy to journal template'),
                icon: 'fa fa-copy',
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
        ],
        readUrl: '',
        gridSize: '200px'
    };
}

accModule.controller('journalTemplatesController', journalTemplatesController);
