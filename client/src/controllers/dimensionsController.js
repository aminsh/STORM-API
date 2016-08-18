import accModule from '../acc.module';

function dimensionsController($scope, logger, translate, confirm,
                              dimensionCategoryApi, dimensionApi,
                              dimensionCreateModalService,
                              dimensionUpdateModalService) {
    "use strict";
    $scope.categories = [];
    $scope.currentCategory = {};

    dimensionCategoryApi.getAll()
        .then((result)=> {
            let cats = result.data;

            $scope.categories = cats.asEnumerable().select(cat =>
                angular.extend({}, cat, {
                    gridOption: gridOptionFactory(cat),
                    editMode: 'read',
                    canShowDimensions: false,
                    errors: []
                })
            ).toArray();
        });

    $scope.createCategory = ()=> {
        $scope.categories.push({
            id: null,
            title: '',
            editMode: 'new',
            canShowDimensions: false,
            isSaving: false,
            errors: []
        });
    }

    $scope.saveCategory = (cat)=> {
        let cmd = {title: cat.title};

        if (cat.editMode == 'new') {
            dimensionCategoryApi.create(cmd)
                .then((result)=> {
                    cat.id = result.id;
                    cat.editMode = 'read';
                    cat.gridOption = gridOptionFactory(cat);

                    logger.success();
                })
                .catch((errors)=> cat.errors = errors)
                .finally(()=> cat.isSaving = false);
        }
        else if (cat.editMode == 'edit') {
            dimensionCategoryApi.update(cat.id, cmd)
                .then(()=> {
                    cat.editMode = 'read';
                    logger.success();
                })
                .catch((errors)=> cat.errors = errors)
                .finally(()=> cat.isSaving = false);
        }
    }

    $scope.startToEditingCategoryTitle = (cat)=> {
        cat.originalData = {
            title: cat.title
        };
        cat.editMode = 'edit';
    }

    $scope.cancelEditingCategoryTitle = (cat)=> {
        cat.title = cat.originalData.title;
        cat.editMode = 'read';
    }

    $scope.changeShowDimensionStatus = (cat) => {
        cat.canShowDimensions = !cat.canShowDimensions;
    };

    $scope.createDimension = (cat)=> {
        dimensionCreateModalService.show({categoryId: cat.id})
            .then(()=> {
                cat.gridOption.refresh();
                logger.success();
            });
    };

    $scope.select = (cat)=> $scope.currentCategory = cat;

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
                            getLocalCategoryById(current.categoryId)
                                .gridOption.refresh();
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
                        .then(function () {
                            dimensionApi.remove(current.id)
                                .then(function () {
                                    getLocalCategoryById(current.categoryId)
                                        .gridOption.refresh();
                                    logger.success();
                                })
                                .catch(function (err) {
                                    err.errors.forEach(function (message) {
                                        logger.error(message);
                                    });
                                });
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

    function getLocalCategoryById(id) {
        let cat = $scope.categories.asEnumerable()
            .first((c)=> c.id == id);

        return cat;
    }

}

accModule.controller('dimensionsController', dimensionsController);
