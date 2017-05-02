import Guid from 'guid';

export default function journalUpdateController($scope,
                                                prompt,
                                                logger,
                                                translate,
                                                navigate,
                                                $stateParams,
                                                $rootScope,
                                                devConstants,
                                                $timeout,
                                                journalApi,
                                                journalLineApi,
                                                subsidiaryLedgerAccountApi,
                                                dimensionCategoryApi,
                                                dimensionApi,
                                                detailAccountApi,
                                                journalAttachImageService,
                                                journalLineAdditionalInformation,
                                                tagApi,
                                                formService) {

    $scope.$emit('close-sidebar');

    $scope.keyUpGridRow = (e, item, field) => {
        if (e.keyCode == 115)
            return ['debtor', 'creditor'].includes(field) && exchangeDebtorAndCreditor(e, item);
        if (e.keyCode == 113)
            return copyFromUpperItem(e, item, field);
    };

    function exchangeDebtorAndCreditor(e, item) {
        e.preventDefault();

        let debtor = item.debtor,
            creditor = item.creditor;

        item.debtor = creditor;
        item.creditor = debtor;
    }

    function copyFromUpperItem(e, item, field) {
        e.preventDefault();

        let currentIndex = $scope.journalLines.indexOf(item);

        if (currentIndex == 0)
            return;

        let upperItem = $scope.journalLines[currentIndex - 1];

        item[field] = upperItem[field];

        if (['subsidiaryLedgerAccountId', 'detailAccountId'].includes(field)) {
            let columnName = field.replace('Id', ''),
                id = item[field],
                model = $scope.columnConfig[columnName].dataSource.asEnumerable()
                    .single(p => p.id == id);

            $scope.columnConfig[columnName].onChanged(model, item);
        }
    }

    let id = $stateParams.id,
        isNewJournal = $stateParams.id == null,
        columnConfig = {
            subsidiaryLedgerAccount: {
                dataSource: [],
                onChanged(item, journalLine) {
                    journalLine.subsidiaryLedgerAccountId = item.id;
                    journalLine.hasDetailAccount = item && item.hasDetailAccount;
                    journalLine.hasDimension1 = item && item.hasDimension1;
                    journalLine.hasDimension2 = item && item.hasDimension2;
                    journalLine.hasDimension3 = item && item.hasDimension3;
                    journalLine.isBankAccount = item && item.isBankAccount;

                    $timeout(() => {
                        if (journalLine.hasDetailAccount)
                            $scope.$broadcast(`detailAccount-focus-${journalLine.id}`);
                    });
                }
            },
            detailAccount: {
                dataSource: [],
                onChanged(item, journalLine){
                    $timeout(() => {
                        $scope.$broadcast(`article-focus-${journalLine.id}`);
                    });
                }
            },
            dimension1: {
                dataSource: []
            },
            dimension2: {
                dataSource: []
            },
            dimension3: {
                dataSource: []
            }
        };


    $scope.errors = [];
    $scope.tags = [];
    $scope.journalLines = [];
    $scope.journal = {
        temporaryNumber: null,
        temporaryDate: null,
        number: null,
        date: null,
        description: '',
        tagIds: [],
        journalType: null
    };
    $scope.journalTypeData = devConstants.enums.JournalType().data;
    $scope.columnConfig = columnConfig;
    $scope.isJournalLineLoading = false;
    $scope.isSaving = false;

    fetch();

    function fetch() {
        $scope.$broadcast('grid-changed');

        if (isNewJournal) {
            $scope.journal.temporaryDate = localStorage.getItem('today');
            journalApi.getMaxNumber()
                .then(result => $scope.journal.temporaryNumber = ++result);

            /* added 2 row by default */

            $timeout(() => {
                $scope.createJournalLine();
                $scope.createJournalLine();
            });
        }


        if (!isNewJournal) {
            $scope.isJournalLineLoading = true;

            journalApi.getById(id)
                .then(result => {
                    $scope.journal = result;
                    $scope.journalLines = result.journalLines;
                    $scope.$broadcast('grid-changed');
                })
                .finally(() => $scope.isJournalLineLoading = false);
        }


        subsidiaryLedgerAccountApi.getAll()
            .then(result => columnConfig.subsidiaryLedgerAccount.dataSource = result.data);

        detailAccountApi.getAll()
            .then(result => columnConfig.detailAccount.dataSource = result.data);

        dimensionCategoryApi.getAllLookupSync().data.forEach((cat, i) => dimensionApi.getByCategory(cat.id)
            .then(result => columnConfig[`dimension${i + 1}`].dataSource = result.data));

        tagApi.getAll().then(result => $scope.tags = result.data);
    }

    $scope.removeJournalLine = item => $scope.journalLines.asEnumerable().remove(item);

    $scope.save = (form) => {
        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        let lines = $scope.journalLines,
            totalRemainder = lines.asEnumerable()
                .sum(line => line.debtor - line.creditor);

        if (totalRemainder != 0)
            return logger.error(translate('Total of debtor and creditor is not equal'));

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        let cmd = Object.assign($scope.journal, {journalLines: $scope.journalLines});

        if (isNewJournal)
            return journalApi.create(cmd)
                .then(result => {
                    logger.success();
                    $scope.journal.id = result.id;
                })
                .catch((errors) => $scope.errors = errors)
                .finally(() => $scope.isSaving = false);

        journalApi.update(id, $scope.journal)
            .then(() => logger.success())
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.createJournalLine = () => {

        let maxRow = $scope.journalLines.length == 0
                ? 0
                : $scope.journalLines.asEnumerable().max(line => line.row),
            newJournal = {
                id: Guid.new(),
                row: ++maxRow,
                generalLedgerAccountId: null,
                subsidiaryLedgerAccountId: null,
                detailAccountId: null,
                dimension1Id: null,
                dimension2Id: null,
                dimension3Id: null,
                article: '',
                debtor: 0,
                creditor: 0
            };

        $scope.journalLines.push(newJournal);

        $timeout(() => {
            $scope.$broadcast('grid-scroll-to-row', {id: newJournal.id});
            $scope.$broadcast(`subsidiaryLedgerAccount-focus-${newJournal.id}`);
            $scope.$broadcast('grid-changed');
        });
    };

    $scope.attachImage = () => {
        journalAttachImageService.show({id: id})
            .then(fileName => {
                $scope.journal.attachmentFileName = fileName;
                logger.success();
            });
    };

    $scope.print = () => navigate('journalPrint', {id: id});

    $scope.additionalInfo = journalLine => {
        journalLineAdditionalInformation.show({
            journal: $scope.journal,
            journalLine
        }).then(data => {
            journalLine.additionalInformation = data;
        });
    };

    $scope.createTag = () => {
        prompt({
            title: translate('Create Tag'),
            text: translate('Enter Tag Title'),
        }).then(inputValue => {

            tagApi.create({title: inputValue})
                .then(result => {
                    let tag = {id: result.id, title: inputValue};
                    $scope.tags.push(tag);
                    $scope.journal.tagId = tag.id;
                });
        });
    };

}

