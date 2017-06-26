"use strict";

export default class ReceivableChequesController {

    constructor(logger,
                devConstants,
                passPayableCheque,
                returnPayableCheque,
                translate) {

        this.logger = logger;
        this.passPayableCheque = passPayableCheque;
        this.returnPayableCheque = returnPayableCheque;

        this.selectedCheque = false;

        this.gridOption = {
            columns: [
                {name: 'number', title: translate('Number'), type: 'string'},
                {name: 'date', title: translate('Date'), type: 'string'},
                {
                    name: 'detailAccountId',
                    title: translate('Bank'),
                    type: 'string',
                    template: '{{item.detailAccountDisplay}}'
                },
                {
                    name: 'chequeStatus',
                    title: translate('Status'),
                    type: 'chequeStatus',
                    template: '{{item.chequeStatusDisplay}}'
                }
            ],
            commands: [],
            selectable: true,
            readUrl: devConstants.urls.payableCheques.getAll()
        };
    }

    onSelectCheque(cheque) {
        this.selectedCheque = cheque;
    }

    passCheque() {
        if (!(this.selectedCheque && this.selectedCheque.chequeStatus == 'normal'))
            return;

        this.passPayableCheque.show({id: this.selectedCheque.id})
            .then(() => {
                this.logger.success();
                this.gridOption.refresh();
            });
    }

    returnCheque() {
        if (!(this.selectedCheque && this.selectedCheque.chequeStatus == 'normal'))
            return;

        this.returnPayableCheque.show({id: this.selectedCheque.id})
            .then(() => {
                this.logger.success();
                this.gridOption.refresh();
            });
    }
}