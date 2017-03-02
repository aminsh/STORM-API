import accModule from '../acc.module';

function banksController($scope, logger, confirm, bankApi, translate, devConstants) {

    let gridOption = $scope.gridOption = {
        columns: [
            {name: 'title', title: translate('Title'), type: 'string',
                template: `<span ng-if="!item.isEditing">{{item.title}}</span>
                    <form name="form">
                    <input ng-if="item.isEditing" class="form-control" name="title" ng-model="item.title" required/>
                    <div ng-messages="form.title.$error" ng-if="form.title.$dirty">
                        <label ng-message="required" class="error">{{'This field is required'|translate}}</label>
                    </div>
                    </form>`}
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
                title: translate('Remove'),
                icon: 'fa fa-trash',
                canShow: current => !current.isEditing,
                action: function (current) {
                    confirm(
                        translate('Remove Bank'),
                        translate('Are you sure ?'))
                        .then(function () {
                            bankApi.remove(current.id)
                                .then(()=> {
                                    $scope.gridOption.refresh();
                                    logger.success();
                                });
                        });
                }
            },
            {
                title: translate('Save'),
                icon: 'fa fa-floppy-o',
                canShow: current => current.isEditing,
                action: current => {
                    if(current.isNew)
                        return bankApi.create(current)
                            .then(result=> {
                               current.id = result.id;
                               current.isNew= false;
                               current.isEditing = false;
                            });
                    bankApi.update(current.id, current)
                        .then(()=> current.isEditing = false);
                }
            },
            {
                title: translate('Cancel'),
                icon: 'fa fa-times',
                canShow: current  => current.isEditing,
                action: current => {
                    if(current.isNew)
                        return gridOption.removeItem(current);

                    current.isEditing = false;
                    current.title = current.originalTitle;
                }
            }
        ],
        readUrl: devConstants.urls.bank.all()
    };

    $scope.create = () => {
        gridOption.addItem({title: '', isEditing: true, isNew: true});
    }


}

accModule.controller('banksController', banksController);