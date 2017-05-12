"use strict";

export class WriteChequeController {
    constructor($scope, data, devConstants, formService, chequeApi, translate) {
        this.$scope = $scope;
        this.formSerivce = formService;
        this.chequeApi = chequeApi;
        this.id = data.chequeId;

        this.cheque = {
            journalLineId: null,
            amount: 0,
            date: null,
            description: ''
        };

        this.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), width: '10%', type: 'number'},
                {name: 'date', title: translate('Date'), type: 'date', width: '10%'},
                {
                    name: 'subsidiaryLedgerAccountDisplay',
                    title: translate('Subsidiary ledger account'),
                    filterable: false,
                    width: '30%'
                },
                {name: 'article', title: translate('Article'), type: 'string', width: '40%'},
                {
                    name: 'creditor',
                    title: translate('Creditor'),
                    type: 'number',
                    width: '10%',
                    template: '{{item.creditor|number}}'
                },
            ],
            commands: [],
            readUrl: devConstants.urls.journal.getPayablesNotHaveChequeLines(data.detailAccountId),
            gridSize: '200px',
            selectable: true
        }
    }

    selectJournalLine(journalLine) {
        this.cheque.journalLineId = journalLine.id;
        this.cheque.amount = journalLine.creditor;
        this.cheque.date = journalLine.date;
        this.cheque.description = journalLine.article;
    }

    save(form) {
        if (form.$invalid)
            return this.formSerivce.setDirty(form);

        this.chequeApi.write(this.id, this.cheque).then(this.$scope.$close);
    }

    close() {
        this.$scope.$dismiss();
    }
}

export function WriteCheque(modalBase) {
    return modalBase({
        controller: 'writeChequeController',
        controllerAs: 'model',
        templateUrl: 'partials/cheque/writeCheque.html',
        size: 'lg'
    });
}