"use strict";

export default class ReceivableChequesController {

    constructor(logger,
                devConstants,
                passReceivableCheque,
                returnReceivableCheque,
                translate) {

        this.logger = logger;
        this.passReceivableCheque = passReceivableCheque;
        this.returnReceivableCheque = returnReceivableCheque;

        this.selectedCheque = false;

        this.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), type: 'string'},
                {name: 'date', title: translate('Date'), type: 'date'},
                {
                    name: 'detailAccountId',
                    title: translate('Receive from'),
                    type: 'string',
                    template: '{{item.detailAccountDisplay}}'
                },
                {name: 'bankName', title: translate('Bank Name'), type: 'string'},
                {name: 'bankBranch', title: translate('Bank Branch'), type: 'string'},
                {
                    name: 'chequeStatus',
                    title: translate('Status'),
                    type: 'chequeStatus',
                    template: '{{item.chequeStatusDisplay}}'
                }
            ],
            commands: [],
            selectable: true,
            readUrl: devConstants.urls.receivableCheques.getAll()
        };
    }

    onSelectCheque(cheque) {
        this.selectedCheque = cheque;
    }

    passCheque() {
        if (!(this.selectedCheque && this.selectedCheque.chequeStatus == 'normal'))
            return;

        this.passReceivableCheque.show({id: this.selectedCheque.id})
            .then(() => {
                this.logger.success();
                this.gridOption.refresh();
            });
    }

    returnCheque() {
        if (!(this.selectedCheque && this.selectedCheque.chequeStatus == 'normal'))
            return;

        this.returnReceivableCheque.show({id: this.selectedCheque.id})
            .then(() => {
                this.logger.success();
                this.gridOption.refresh();
            });
    }
}