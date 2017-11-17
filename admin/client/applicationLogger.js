"use strict";

class ApplicationLoggerController{
    constructor(tabs){

        tabs.setTab("applicationLogger");

        let columns =[
            {
                name: 'status',
                title: 'Status',
                type: 'applicationLoggerStatus',
                template: `<i title="{{item.status}}" ng-if="item.status === 'pending'" class="fa fa-history fa-lg text-success"></i>
                               <i title="{{item.status}}" ng-if="item.status === 'success'" class="fa fa-check fa-lg text-navy"></i>
                               <i title="{{item.status}}" ng-if="item.status === 'invalid'" class="fa fa-exclamation-triangle fa-lg text-warning"></i>
                               <i title="{{item.status}}" ng-if="item.status === 'error'" class="fa fa-times-circle fa-lg text-danger"></i>
                    `
            },
            {
                name: 'branchId',
                title: 'Branch',
                type:'branch',
                template: '<span>{{item.branchName}}</span>'
            },
            {
                name: 'createdAt',
                title: 'Created at',
                filterable: false,
                sortable: false,
                template: `<span style="font-family: Arial">{{item.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}</span>`
            },
            {
                name: 'updatedAt',
                title: 'Updated at',
                filterable: false,
                sortable: false,
                template: `<span style="font-family: Arial">{{item.updatedAt | date:'yyyy-MM-dd HH:mm:ss' }}</span>`
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
                filterable: false,
                sortable: false,
                template: '<json-formatter json="item.command" style="direction: ltr"></json-formatter>'
            },
            {
                name: 'state',
                type: 'string',
                title: 'State',
                width: '300px',
                filterable: false,
                sortable: false,
                template: '<json-formatter json="item.state" style="direction: ltr"></json-formatter>'
            },
            {
                name: 'result',
                type: 'string',
                title: 'Result',
                width: '300px',
                filterable: false,
                sortable: false,
                template: '<json-formatter json="item.result" style="direction: ltr"></json-formatter>'
            }
        ];

        columns.forEach(col => {

            if(['branchName', 'status'].includes(col.name))
                return;

           col.css = 'text-left';
           col.header = {css: 'text-left'}
        });

        //columns = columns.reverse();


        this.gridOption = {
            columns,
            commands: [


            ],
            gridSize: '700px',
            readUrl: '/api/application-logger'
        }

    }
}

export default ApplicationLoggerController;