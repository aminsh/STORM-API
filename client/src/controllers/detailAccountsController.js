import accModule from '../acc.module';

function detailAccountsController($scope, logger, translate, confirm, navigate,
                                  detailAccountApi) {
    "use strict";

    $scope.gridOption = {
        columns: [
            {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
            {name: 'title', title: translate('Title'), type: 'string'}
        ],
        commands: [
            {
                title: translate('Edit'),
                name: 'edit detail account',
                action: function (current) {
                    navigate('detailAccountUpdate', {id: current.id});
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
}

accModule.controller('detailAccountsController', detailAccountsController);