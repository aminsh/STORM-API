import accModule from '../acc.module';

function journalUpdateController($scope, logger, confirm, translate, navigate, $routeParams, $rootScope,
                                 journalApi, journalLineApi, subsidiaryLedgerAccountApi,
                                 journalLineCreateControllerModalService,
                                 journalLineUpdateControllerModalService,
                                 journalBookkeepingService,
                                 journalAttachImageService,
                                 writeChequeOnJournalLineEntryService) {

    let id = $routeParams.id;
    $scope.errors = [];
    $scope.journal = {
        temporaryNumber: null,
        temporaryDate: null,
        number: null,
        date: null,
        description: ''
    };

    $scope.canShowNumberAndDate = false;

    function fetch() {
        journalApi.getById(id)
            .then((result)=> {
                $scope.journal = result;

                $scope.canShowNumberAndDate = result.journalStatus != 'Temporary'
            });
    }

    fetch();

    $scope.gridOption = {
        columns: [
            {name: 'row', title: translate('Row'), width: '60px', type: 'number'},
            {
                name: 'generalLedgerAccountId',
                title: translate('General ledger account'),
                type: 'generalLedgerAccount',
                template: '${data.generalLedgerAccountCode}',
                width: '70px'
            },
            {
                name: 'subsidiaryLedgerAccountId',
                title: translate('Subsidiary ledger account'),
                type: 'subsidiaryLedgerAccount',
                template: '${data.subsidiaryLedgerAccountCode}',
                width: '70px'
            },
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '${data.detailAccountCode}',
                width: '100px'
            },
            {name: 'article', title: translate('Article'), width: '300px', type: 'string'},
            {
                name: 'debtor', title: translate('Debtor'), width: '100px', type: 'number', format: '{0:#,##}',
                aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
            },
            {
                name: 'creditor', title: translate('Creditor'), width: '100px', type: 'number', format: '{0:#,##}',
                aggregates: ['sum'], footerTemplate: "{0}: #= kendo.toString(sum,'n0') #".format(translate('Sum'))
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                action: function (current) {
                    journalLineUpdateControllerModalService
                        .show({
                            journalId: id,
                            id: current.id
                        })
                        .then(()=> $scope.gridOption.refresh());
                }
            },
            {
                title: translate('Remove'),
                action: function (current) {
                    confirm(
                        translate('Remove General ledger account'),
                        translate('Are you sure ?'))
                        .then(function () {
                            journalLineApi.remove(current.id)
                                .then(function () {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch((errors)=>
                                    logger.error(errors.join('<b/>')));
                        })

                }
            }
        ],
        current: null,
        selectable: true,
        filterable: false,
        readUrl: journalLineApi.url.getAll(id)
    };

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid)
            return;

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        journalApi.update(id, $scope.journal)
            .then(()=> {
                logger.success();
            })
            .catch((errors)=>$scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.createJournalLine = ()=> {
        journalLineCreateControllerModalService
            .show({journalId: id})
            .then(()=> $scope.gridOption.refresh())
    };

    $scope.bookkeeping = ()=> {
        journalBookkeepingService.show({id: id})
            .then(()=> {
                logger.success();
                fetch();
            });
    };

    $scope.attachImage = ()=> {
        journalAttachImageService.show({id: id})
            .then(()=> {
                logger.success();
                fetch();
            });
    }

    $scope.writeCheque = ()=> {
        $rootScope.blockUi.block();

        let current = $scope.gridOption.current;
        subsidiaryLedgerAccountApi.getById(current.subsidiaryLedgerAccountId)
            .then((result)=> {
                $rootScope.blockUi.unBlock();

                if (result.isBankAccount) {
                    writeChequeOnJournalLineEntryService.show({
                        journalLineId: current.id,
                        detailAccountId: current.detailAccountId,
                        detailAccountDisplay: current.detailAccountDisplay,
                        amount: current.creditor,
                        description: current.article,
                        date: $scope.journal.date
                    }).then(()=> {
                        $scope.gridOption.refresh();
                        logger.success();
                    });
                }
                else {
                    logger.error(translate('The current subsidiaryLedgerAccount is not bank account'));
                }
            });


    }


}

accModule.controller('journalUpdateController', journalUpdateController);
