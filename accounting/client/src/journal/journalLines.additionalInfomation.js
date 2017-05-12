"use strict";

export class JournalLineAdditionalInformation {
    constructor($scope, chequeApi, data, translate) {
        this.$scope = $scope;
        this.chequeApi = chequeApi;
        this.translate = translate;

        this.cheques = [];

        this.journalLine = data.journalLine;

        this.additionalInfo = {
            /*cheque: this.journalLine.cheque || {
                id: null,
                amount: this.journalLine.creditor,
                date: data.journal.temporaryDate,
                description: this.journalLine.article
            },*/
            dimension1Id: this.journalLine.dimension1Id,
            dimension2Id: this.journalLine.dimension2Id,
            dimension3Id: this.journalLine.dimension3Id,
            receipt: this.journalLine.receipt || {
                number: null,
                date: null
            }
        };

        this.fetch();
    }

    fetch() {
        let translate = this.translate;

        if (this.journalLine.isBankAccount)
            this.chequeApi
                .getAllWhites(this.journalLine.detailAccountId)
                .then(result => {
                    result.forEach(c => c.categoryDisplay = `${translate('Received on')} : ${c.category.receivedOn} - ${c.category.totalPages} ${translate('Pages')}`);
                    this.cheques = result;
                });
    }

    save() {
        this.journalLine.cheque = this.additionalInfo.cheque;
        this.journalLine.receipt = this.additionalInfo.receipt;

        this.$scope.$close(this.journalLine);
    }

    close() {
        this.$scope.$dismiss();
    }
}

export function JournalLineAdditionalInformationModal(modalBase) {
    return modalBase({
        controller: 'journalLineAdditionalInformationController',
        controllerAs: 'model',
        templateUrl: 'partials/journal/journalLines.additionalInformation.html'
    });
}