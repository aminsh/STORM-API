import accModule from '../acc.module';

function banksController($scope, logger, confirm, bankApi, constants, translate) {
    $scope.gridDateSource = {
        transport: {
            read: {
                url: constants.urls.bank.all(),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                type: 'GET'
            },
            update: {
                url: (model)=> '/api/banks/{0}'.format(model.id),
                dataType: 'json',
                type: "PUT"
            },
            create: {
                url: '/api/banks',
                dataType: 'json',
                type: 'POST'
            },
            destroy: {
                url: (model)=> '/api/banks/{0}'.format(model.id),
                dataType: 'json',
                type: "DELETE"
            }
        },
        pageSize: 20,
        schema: {
            data: 'data',
            total: 'total',
            model: {
                id: 'id',
                fields: {
                    title: {validation: {required: true}}
                },

            }
        },
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true
    };


    let gridOption = $scope.gridOption = {
        columns: [
            {name: 'title', title: translate('Title'), type: 'string'}
        ],
        commands: [
            'edit',
            {
                title: translate('Remove'),
                action: function (current) {
                    confirm(
                        translate('Remove Bank'),
                        translate('Are you sure ?'))
                        .then(function () {
                            gridOption.grid.dataSource.remove(current);
                            gridOption.grid.dataSource.sync()
                                .then(function () {
                                    logger.success();
                                    $scope.$apply();
                                });
                        });
                }
            }
        ],
        editable: "inline"
    }

    $scope.create = ()=> {
        gridOption.grid.addRow();
    }


}

accModule.controller('banksController', banksController);