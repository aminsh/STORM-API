"use strict";

export default class BranchesController {
    constructor(branchApi, logger, confirm, tabs) {
        this.branchApi = branchApi;
        this.logger = logger;
        this.confirm = confirm;
        tabs.setTab("branches");

        this.gridOption = {
            columns: [
                {
                    name: '',
                    title: '',
                    width: '2%',
                    filterable: false,
                    sortable: false
                },
                {
                    name: 'logo',
                    title: '',
                    width: '10%',
                    filterable: false,
                    sortable: false,
                    template: `<img class="img-responsive img-small" 
                                width="50px"  
                                style="height:50px" 
                                alt="image" 
                                ng-src="{{item.logo}}">`
                },
                {
                    name: 'id',
                    title: 'Id',
                    width: '18%',
                    type: 'string'
                },
                {
                    width: '30%',
                    name: 'name',
                    type: 'string',
                    title: 'Name',
                    template: '<h3>{{item.name}}</h3>'
                },
                {
                    width: '15%',
                    name: 'branchActiveTimeMonths',
                    type: 'string',
                    title: 'Active months',
                    css:'text-center',
                    header:{
                        css:'text-center'
                    },
                    template: '<h5>{{item.branchActiveTimeMonths}}</h5>'
                },
                {
                    width: '15%',
                    name: 'branchActiveTimeDays',
                    type: 'string',
                    title: 'Active days',
                    css:'text-center',
                    header:{
                        css:'text-center'
                    },
                    template: '<h5>{{item.branchActiveTimeDays}}</h4>',
                },
                {
                    name: 'status',
                    title: 'Status',
                    width: '10%',
                    filterable: false,
                    sortable: false,
                    template: `<span
                            style="font-size: 14px"
                            ng-class="{'label label-primary':item.status=='active','label label-danger':item.status=='pending'}">{{item.status}}</span>`
                }
            ],
            commands: [
                {
                    title: 'Activate',
                    icon: 'fa fa-check text-navy fa-lg',
                    action: current => this.activate(current),
                    canShow: current => current.status == 'pending'
                },
                {
                    title: 'Deactivate',
                    icon: 'fa fa-close text-danger fa-lg',
                    action: current => this.deactivate(current),
                    canShow: current => current.status == 'active'
                },
                {
                    title: 'Add me',
                    icon: 'fa fa-user-plus text-success fa-lg',
                    action: current => this.addMe(current),
                },
                {
                    title: 'Remove me',
                    icon: 'fa fa-user-times text-danger fa-lg',
                    action: current => this.removeMe(current),
                },
                {
                    title: 'Default logo',
                    icon: 'fa fa-file-photo-o text-success fa-lg',
                    action: current => this.setDefaultLogo(current)
                },
                {
                    title: 'Renew chart of account',
                    icon: 'fa fa-repeat text-success fa-lg',
                    action: current => this.renewChartOfAccounts(current)
                },
                {
                    title: 'Remove',
                    icon: 'fa fa-trash text-danger fa-lg',
                    action: current => this.remove(current)
                },

            ],
            gridSize: '700px',
            readUrl: '/api/branches'
        }
    }

    activate(branch) {
        this.branchApi.activate(branch.id)
            .then(() => {
                branch.status = 'active';
                this.logger.success()
            });
    }

    deactivate(branch) {
        this.branchApi.deactivate(branch.id)
            .then(() => {
                branch.status = 'pending';
                this.logger.success()
            });
    }

    addMe(branch) {
        this.branchApi.addMeToBranch(branch.id)
            .then(() => this.logger.success());
    }

    removeMe(branch){
        this.branchApi.removeMeFromBranch(branch.id)
            .then(()=> this.logger.success());
    }

    remove(branch) {
        this.confirm(
            'Are you sure ?',
            'Remove current branch')
            .then(() => {
                this.branchApi.remove(branch.id)
                    .then(() => {
                        this.logger.success();
                        this.gridOption.refresh();
                    });
            });
    }

    setDefaultLogo(branch) {
        this.branchApi.setDefaultLogo(branch.id)
            .then(() => {
                this.logger.success();
                this.gridOption.refresh();
            });
    }

    renewChartOfAccounts(branch){
        this.confirm(
            'Are you sure ?',
            'Renew chart of accounts')
            .then(() => {
                this.branchApi.renewChartOfAccounts(branch.id)
                    .then(() => {
                        this.logger.success();
                    });
            });
    }

}