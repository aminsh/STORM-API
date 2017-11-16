"use strict";

class ApplicationLoggerController{
    constructor(tabs){

        tabs.setTab("applicationLogger");

        this.gridOption = {
            columns: [
                {
                    name: 'createdAt',
                    title: 'Created at',
                    filterable: false,
                    sortable: false,
                    template: `<span>{{item.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</span>`
                },
                {
                    name: 'updatedAt',
                    title: 'Updated at',
                    filterable: false,
                    sortable: false,
                    template: `<span>{{item.updatedAt | date:'fullDate' }}</span>`
                },
                {
                    name: 'service',
                    title: 'Service',
                    type: 'string'
                },
                {
                    name: 'command',
                    type: 'string',
                    title: 'Command',
                    width: '300px',
                    template: '<json-formatter json="item.command" style="direction: ltr"></json-formatter>'
                },
                {
                    name: 'state',
                    type: 'string',
                    title: 'State',
                    width: '300px',
                    template: '<json-formatter json="item.state" style="direction: ltr"></json-formatter>'
                },
                {
                    name: 'result',
                    type: 'string',
                    title: 'Result',
                    width: '300px',
                    template: '<json-formatter json="item.result" style="direction: ltr"></json-formatter>'
                }
            ],
            commands: [


            ],
            gridSize: '700px',
            readUrl: '/api/application-logger'
        }

    }
}

export default ApplicationLoggerController;