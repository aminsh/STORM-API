import Guid from 'guid';

export default class {
    constructor($scope,
                $q,
                prompt,
                logger,
                translate,
                navigate,
                $stateParams,
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

        this.$scope = $scope;
        this.$q = $q;
        this.$timeout = $timeout;
        this.prompt = prompt;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;

        this.journalApi = journalApi;
        this.journalLineApi = journalLineApi;
        this.subsidiaryLedgerAccountApi = subsidiaryLedgerAccountApi;
        this.dimensionCategoryApi = dimensionCategoryApi;
        this.dimensionApi = dimensionApi;
        this.detailAccountApi = detailAccountApi;
        this.journalAttachImageService = journalAttachImageService;
        this.journalLineAdditionalInformation = journalLineAdditionalInformation;
        this.tagApi = tagApi;

        this.id = $stateParams.id;
        this.isNewJournal = $stateParams.id == null;
        this.errors = [];
        this.tags = [];
        this.journalLines = [];
        this.journal = {
            temporaryNumber: null,
            temporaryDate: null,
            number: null,
            date: null,
            description: '',
            tagId: null,
            journalType: null
        };
        this.journalTypeData = devConstants.enums.JournalType().data;
        this.isJournalLineLoading = false;
        this.isSaving = false;

        this.subsidiaryLedgerAccount = {
            data: [],
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
        };

        this.detailAccount = {
            data: [],
            onChanged(item, journalLine){
                $timeout(() => {
                    $scope.$broadcast(`article-focus-${journalLine.id}`);
                });
            }
        };

        this.tags = [];

        $q.all([
            subsidiaryLedgerAccountApi.getAll(),
            detailAccountApi.getAll(),
            tagApi.getAll()
        ]).then(result => {
            this.subsidiaryLedgerAccount.data = result[0].data;
            this.detailAccount.data = result[1].data;
            this.tags = result[2].data;

            this.fetch();
        });
    }

    fetch() {
        let $scope = this.$scope,
            $timeout = this.$timeout,
            isNewJournal = this.isNewJournal;

        $scope.$broadcast('grid-changed');

        if (isNewJournal) {
            this.journal.temporaryDate = localStorage.getItem('today');
            this.journalApi.getMaxNumber()
                .then(result => this.journal.temporaryNumber = ++result);

            /* added 2 row by default */

            $timeout(() => [1, 2].forEach(this.createJournalLine));
        }

        if (!isNewJournal) {
            this.isJournalLineLoading = true;

            this.journalApi.getById(this.id)
                .then(result => {
                    this.journal = result;
                    this.journalLines = result.journalLines;
                    this.$scope.$broadcast('grid-changed');
                })
                .finally(() => this.isJournalLineLoading = false);
        }
    }

    keyUpGridRow(e, item, field) {
        if (e.keyCode == 115)
            return ['debtor', 'creditor'].includes(field) &&
                this.exchangeDebtorAndCreditor(e, item);
        if (e.keyCode == 113)
            return this.copyFromUpperItem(e, item, field);
    }

    removeJournalLine(item) {
        this.journalLines.asEnumerable().remove(item);
    }

    save(form) {
        let logger = this.logger,
            formService = this.formService,
            errors = this.errors,
            journal = this.journal,
            journalLines = this.journalLines,
            isSaving = this.isSaving;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        let lines = this.journalLines,
            totalRemainder = lines.asEnumerable()
                .sum(line => line.debtor - line.creditor);

        if (totalRemainder != 0)
            return logger.error(this.translate('Total of debtor and creditor is not equal'));

        errors.asEnumerable().removeAll();
        isSaving = true;

        let cmd = Object.assign(journal, {journalLines});

        if (this.isNewJournal)
            return this.journalApi.create(cmd)
                .then(result => {
                    logger.success();
                    journal.id = result.id;
                })
                .catch(err => errors = err)
                .finally(() => isSaving = false);

        this.journalApi.update(this.id, this.journal)
            .then(() => logger.success())
            .catch(err =>{
                console.log(err);
                errors = err;
            })
            .finally(() => isSaving = false);
    }

    createJournalLine() {
        let $scope = this.$scope;

        let maxRow = this.journalLines.length == 0
                ? 0
                : this.journalLines.asEnumerable().max(line => line.row),
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

        this.journalLines.push(newJournal);

        this.$timeout(() => {
            $scope.$broadcast('grid-scroll-to-row', {id: newJournal.id});
            $scope.$broadcast(`subsidiaryLedgerAccount-focus-${newJournal.id}`);
            $scope.$broadcast('grid-changed');
        });
    }

    attachImage() {
        this.journalAttachImageService.show({id: id})
            .then(fileName => {
                this.journal.attachmentFileName = fileName;
                this.logger.success();
            });
    }

    print() {
        this.navigate('journalPrint', {id: id});
    }

    additionalInfo(journalLine) {
        this.journalLineAdditionalInformation.show({
            journal: this.journal,
            journalLine
        }).then(data => {
            journalLine.additionalInformation = data;
        });
    }

    createTag() {
        this.prompt({
            title: this.translate('Create Tag'),
            text: this.translate('Enter Tag Title'),
        }).then(inputValue => {

            this.tagApi.create({title: inputValue})
                .then(result => {
                    let tag = {id: result.id, title: inputValue};
                    this.tags.push(tag);
                    this.journal.tagId = tag.id;
                });
        });
    }

    //privates

    exchangeDebtorAndCreditor(e, item) {
        e.preventDefault();

        let debtor = item.debtor,
            creditor = item.creditor;

        item.debtor = creditor;
        item.creditor = debtor;
    }

    copyFromUpperItem(e, item, field) {
        e.preventDefault();

        let currentIndex = this.journalLines.indexOf(item);

        if (currentIndex == 0)
            return;

        let upperItem = this.journalLines[currentIndex - 1];

        item[field] = upperItem[field];

        if (['subsidiaryLedgerAccountId', 'detailAccountId'].includes(field)) {
            let columnName = field.replace('Id', ''),
                id = item[field],
                model = this[columnName].data.asEnumerable()
                    .single(p => p.id == id);

            this[columnName].onChanged(model, item);
        }
    }
}


