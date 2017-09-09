"use strict";

class InventoryInputsController {

    constructor(translate, devConstants) {

        this.gridOption = {
            columns: [
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '10%',
                    type: 'date'
                },
                {
                    name: 'number',
                    title: translate('Number'),
                    width: '10%',
                    type: 'number'
                },
                {
                    name: 'ioType',
                    title: translate('Input type'),
                    width: '15%',
                    type: 'string',
                    template: '<span>{{item.ioTypeDisplay}}</span>'
                },
                {
                    name: 'description',
                    title: translate('Description'),
                    width: '20%',
                    type: 'string'
                }

            ],
            commands: [],
            readUrl: devConstants.urls.inventory.getAllInputs()
        };

    }
}

export default InventoryInputsController;