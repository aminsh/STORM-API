"use strict";

export default class FiscalPeriodController {
    constructor(translate, devConstants) {

        this.gridOption = {
            columns: [
                {
                    name: 'title',
                    title: translate('Title'),
                    type: 'string',
                    width: '60%'
                },
                {
                    name: 'minDate',
                    title: translate('From date'),
                    type: 'date',
                    width: '20%'
                },
                {
                    name: 'maxDate',
                    title: translate('To date'),
                    type: 'date',
                    width: '20%'
                }
            ],
            commands: [],
            readUrl: devConstants.urls.period.all(),
        };
    }
}