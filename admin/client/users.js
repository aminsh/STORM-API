"use strict";

export default class UsersController {
    constructor(logger, confirm, userApi) {
        this.logger = logger;
        this.confirm = confirm;
        this.userApi = userApi;

        this.gridOption = {
            columns: [
                {
                    name: 'image',
                    title: '',
                    width: '10%',
                    filterable: false,
                    sortable: false,
                    template: `<img class="img-responsive img-circle img-small" 
                                width="50px"  
                                style="height:50px" 
                                alt="image" 
                                ng-src="{{item.image ? item.image : '/public/images/user.png'}}">`
                },
                {
                    name: 'id',
                    title: 'Id',
                    width: '20%',
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
                    name: 'email',
                    title: 'Email',
                    width: '10%',
                    type: 'string',
                },
                {
                    name: 'state',
                    title: 'state',
                    width: '10%',
                    filterable: false,
                    sortable: false,
                    template: `<span
                            style="font-size: 14px"
                            ng-class="{'label label-primary':item.state=='active','label label-danger':item.state=='pending'}">{{item.state}}</span>`
                }
            ],
            commands: [
                {
                    title: 'Remove',
                    icon: 'fa fa-trash text-danger fa-lg',
                    action: current => this.remove(current)
                }
            ],
            gridSize: '700px',
            readUrl: '/api/users'
        }
    }

    remove(user) {

        this.confirm('Are you sure ?', 'Remove current user')
            .then(() => this.userApi.remove(user.id)
                .then(() => {
                    this.logger.success();
                    this.gridOption.refresh();
                }));

    }
}