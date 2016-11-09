import accModule from '../acc.module';

function detailAccountsController($scope, logger, translate, confirm, navigate,
                                  detailAccountApi,
                                  detailAccountCreateModalService,
                                  detailAccountUpdateModalService) {
    "use strict";

    $scope.gridOption = {
        columns: [
            {
                name: 'isActive',
                title: translate('Is active ?'),
                type: 'activeType',
                width: '150px',
                template: '<i class="glyphicon glyphicon-${data.isActive ? "ok-circle" : "remove-circle"}"' +
                'style="font-size: 20px;color:${data.isActive ? "green" : "red"}">' +
                '</i>'
            },
            {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
            {name: 'title', title: translate('Title'), type: 'string'}
        ],
        commands: [
            {
                title: translate('Edit'),
                name: 'edit detail account',
                action: function (current) {
                    detailAccountUpdateModalService.show({id: current.id})
                        .then(()=> $scope.gridOption.refresh());
                }
            },
            {
                title: translate('Remove'),
                action: function (current) {
                    confirm(
                        translate('Remove Detail account'),
                        translate('Are you sure ?'))
                        .then(function () {
                            detailAccountApi.remove(current.id)
                                .then(function () {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch((errors)=> $scope.errors = errors)
                                .finally(()=> $scope.isSaving = false);
                        })

                }
            }
        ],
        readUrl: detailAccountApi.url.getAll
    };

    $scope.create = ()=> detailAccountCreateModalService.show()
        .then(()=> $scope.gridOption.refresh());
}

accModule.controller('detailAccountsController', detailAccountsController);