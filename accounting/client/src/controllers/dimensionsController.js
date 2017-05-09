import accModule from '../acc.module';

function dimensionsController($scope, logger, translate, confirm, devConstants, $timeout,
                              dimensionCategoryApi, dimensionApi,
                              dimensionCreateModalService,
                              dimensionUpdateModalService) {
    $scope.errors = [];
    $scope.dimensionCategories = [];

    $scope.gridOption = {
        columns: [
            {
                name: 'title',
                title: translate('Title'),
                type: 'string',
                template: `<span ng-if="!item.isEditing">{{item.title}}</span>
                    <form name="form">
                    <input ng-if="item.isEditing" class="form-control" name="title" ng-model="item.title" required/>
                    <div ng-messages="form.title.$error" ng-if="form.title.$dirty">
                        <label ng-message="required" class="error">{{'This field is required'|translate}}</label>
                    </div>
                    </form>`
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                icon: 'fa fa-edit',
                canShow: current => !current.isEditing,
                action: current => {
                    current.originalTitle = current.title;
                    current.isEditing = true;
                }
            },
            {
                title: translate('Save'),
                icon: 'fa fa-floppy-o',
                canShow: current => current.isEditing,
                action: current => {
                    if (!current.title) return;

                    dimensionCategoryApi.update(current.id, current)
                        .then(() => current.isEditing = false);
                }
            },
            {
                title: translate('Cancel'),
                icon: 'fa fa-times',
                canShow: current => current.isEditing,
                action: current => {
                    current.title = current.originalTitle;
                    current.isEditing = false;
                }
            }
        ],
        selectable: true,
        filterable: false,
        sortable: false,
        gridSize: '150px',
        readUrl: dimensionCategoryApi.url.getAll,
        mapper: item => item.isEditig = false
    };

    $scope.current = false;
    $scope.gridDimensions = false;

    $scope.onCurrentChanged = (current) => {
        $scope.current = current == null ? false : current;
        $scope.dimensionGridOption.readUrl = dimensionApi.url.getAll(current.id);
    };

    $scope.createDimension = () => {
        dimensionCreateModalService.show({categoryId: $scope.current.id})
            .then(() => {
                $scope.dimensionGridOption.refresh();
                logger.success();
            });
    };

    $scope.dimensionGridOption = {
        columns: [
            {name: 'code', title: translate('Code'), width: '120px', type: 'string'},
            {
                name: 'title',
                title: translate('Title'),
                type: 'string',
                template: `<a ui-sref=".edit({id: item.id})">{{item.title}}</a>`
            }
        ],
        commands: [
            {
                title: translate('Remove'),
                icon: 'fa fa-trash text-danger',
                action: function (current) {
                    confirm(
                        translate('Remove Dimension'),
                        translate('Are you sure ?'))
                        .then(() => {
                            dimensionApi.remove(current.id)
                                .then(function () {
                                    $scope.dimensionGridOption.refresh();
                                    logger.success();
                                })
                                .catch((err) => $scope.errors = err);
                        })

                }
            }
        ],
        readUrl: '',
        gridSize: '200px'
    };
}

accModule.controller('dimensionsController', dimensionsController);
