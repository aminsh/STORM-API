"use strict";

export default class FiscalPeriodController {
    constructor(translate, devConstants) {

        this.gridOption = {
            columns: [
                {
                    name: 'title',
                    title: translate('Title'),
                    width: '80%',
                    type: 'string'
                },
                {
                    name: 'minDate',
                    title: translate('From date'),
                    width: '10%',
                    type: 'date'
                },
                {
                    name: 'maxDate',
                    title: translate('To date'),
                    type: 'date',
                    width: '10%'
                }
            ],
            commands: [],
            readUrl: devConstants.urls.period.all(),
        };
    }
}