"use strict";

class ApplicationLoggerController {
    constructor(clipboard) {

        this.clipboard = clipboard;

        // tabs.setTab("applicationLogger");

        let columns = [
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
                type: 'branch',
                model: {
                    copy: text => this.clipboard.copyText(text)
                },
                template: `<span>{{item.branchName}}</span>
                <i title="copy branchId" class="fa fa-copy fa-lg text-success pointer" ng-click="column.model.copy(item.branchId)"></i>`
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
                model: {
                    copy: text => this.copy(text)
                },
                template: `
                    <json-formatter json="item.command" style="direction: ltr"></json-formatter>
                    <i title="copy" class="fa fa-copy fa-lg text-success pointer" ng-click="column.model.copy(item.command)" 
                    ng-if="item.command"></i>`
            },
            {
                name: 'state',
                type: 'string',
                title: 'State',
                width: '300px',
                filterable: false,
                sortable: false,
                model: {
                    copy: text => this.copy(text)
                },
                template: `<json-formatter json="item.state" style="direction: ltr"></json-formatter>
                <i title="copy" class="fa fa-copy fa-lg text-success pointer" ng-click="column.model.copy(item.state)" 
                ng-if="item.state"></i>`
            },
            {
                name: 'result',
                type: 'string',
                title: 'Result',
                width: '300px',
                filterable: false,
                sortable: false,
                model: {
                    copy: text => this.copy(text)
                },
                template: `<json-formatter json="item.result" style="direction: ltr"></json-formatter>
                <i title="copy" class="fa fa-copy fa-lg text-success pointer" ng-click="column.model.copy(item.result)" 
                ng-if="item.result"></i>`
            }
        ];

        columns.forEach(col => {

            if (['branchName', 'status'].includes(col.name))
                return;

            col.css = 'text-left';
            col.header = {css: 'text-left'}
        });

        //columns = columns.reverse();


        this.gridOption = {
            columns,
            commands: [],
            gridSize: '700px',
            readUrl: '/api/application-logger'
        }

    }

    copy(obj) {
        this.clipboard.copyText(JSON.stringify(obj));
    }


}

export default ApplicationLoggerController;