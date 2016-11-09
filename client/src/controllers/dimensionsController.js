import accModule from '../acc.module';

function dimensionsController($scope, logger, translate, confirm, constants, $timeout,
                              dimensionCategoryApi, dimensionApi,
                              dimensionCreateModalService,
                              dimensionUpdateModalService) {
    "use strict";
    $scope.errors = [];

    $scope.gridDateSource = {
        transport: {
            read: {
                url: constants.urls.dimensionCategory.all(),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                type: 'GET'
            },
            update: {
                url: (model)=> `/api/dimension-categories/${model.id}`,
                dataType: 'json',
                type: "PUT"
            },
            parameterMap: (options, method)=> {
                if (method == 'read')
                    $scope.onCurrentChanged(null);
                return options;
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
        serverSorting: true,
    };

    $scope.gridOption = {
        columns: [
            {name: 'title', title: translate('Title'), type: 'string'}
        ],
        commands: ['edit'],
        editable: "inline",
        selectable: true,
        filterable: false,
        gridSize: '200px'
    };

    $scope.current = false;
    $scope.gridDimensions = false;

    $scope.onCurrentChanged = (current)=> {
        $scope.current = current == null ? false : current;

        $scope.gridDimensions = false;

        if (!$scope.$$phase)
            $scope.$apply();

        if (current != null)
            $timeout(()=> $scope.gridDimensions = gridOptionFactory(current), 0);
    };

    $scope.createDimension = (cat)=> {
        dimensionCreateModalService.show({categoryId: cat.id})
            .then(()=> {
                cat.gridOption.refresh();
                logger.success();
            });
    };

    function gridOptionFactory(cat) {
        let columns = [
            {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
            {name: 'title', title: translate('Title'), type: 'string'}
        ];

        let commands = [
            {
                title: translate('Edit'),
                action: function (current) {
                    dimensionUpdateModalService.show({id: current.id})
                        .then(()=> {
                            $scope.gridDimensions.refresh();
                            logger.success();
                        });
                }
            },
            {
                title: translate('Remove'),
                action: function (current) {
                    confirm(
                        translate('Remove Dimension'),
                        translate('Are you sure ?'))
                        .then(()=> {
                            dimensionApi.remove(current.id)
                                .then(function () {
                                    $scope.gridDimensions.refresh();
                                    logger.success();
                                })
                                .catch((err)=> $scope.errors = err);
                        })

                }
            }
        ];

        return {
            columns: columns,
            commands: commands,
            readUrl: dimensionApi.url.getAll(cat.id)
        }
    }

}

accModule.controller('dimensionsController', dimensionsController);
