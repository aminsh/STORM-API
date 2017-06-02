import accModule from '../acc.module';

function detailAccountsController($scope, logger, translate, confirm,
                                  detailAccountApi,
                                  devConstants) {
    "use strict";

    $scope.gridOption = {
        columns: [
            {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
            {
                name: 'title',
                title: translate('Title'),
                type: 'string',
                template: `<a ui-sref=".edit({id: item.id})">{{item.title}}</a>`
            },
            {
                name: 'isActive',
                title: translate('Is active ?'),
                type: 'activeType',
                width: '150px',
                template: `<i class="fa"
                          ng-class="{'fa-check text-navy': item.isActive,
                                     'fa-times text-danger': !item.isActive}">
                       </i>`
            },
        ],
        commands: [
            {
                title: translate('Remove'),
                icon: 'fa fa-trash text-danger',
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
                                .catch((errors) => $scope.errors = errors)
                                .finally(() => $scope.isSaving = false);
                        })

                }
            }
        ],
        readUrl: devConstants.urls.detailAccount.all()
    };
}

accModule.controller('detailAccountsController', detailAccountsController);