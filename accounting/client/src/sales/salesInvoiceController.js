import accModule from '../acc.module';

export default class SalesInvoiceController {
    constructor(navigate,
                //salesInvoiceApi,
                formService,
                detailAccountApi,
                translate,
                devConstants,
                $q) {

        this.gridOptions =
            {
                columns: [
                    {name: 'number', title: translate('number'), type: 'number', width: '120px'},
                    {name: 'date', title: translate('date'), type: 'date', width: '120px'},
                    {name: 'customer', title: translate('customer'), type: 'string', width: '120px'},
                    {
                        name: 'invoiceType',
                        title: translate('invoiceType'),
                        type: 'invoiceType',
                        width: '120px',
                        template: '{{item.invoiceTypeDisplay}}'
                    },
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
                        icon: 'fa fa-trash text-danger',
                        canShow: current => !current.isEditing,
                        action: function (current) {
                            confirm(
                                translate('Remove Bank'),
                                translate('Are you sure ?'))
                                .then(function () {
                                    salesInvoiceApi.remove(current.id)
                                        .then(() => {
                                            $scope.gridOption.refresh();
                                            //logger.success();
                                        });
                                });
                        }
                    },
                    {
                        title: translate('Save'),
                        icon: 'fa fa-floppy-o',
                        canShow: current => current.isEditing,
                        action: current => {
                            if (current.isNew)
                                return bankApi.create(current)
                                    .then(result => {
                                        current.id = result.id;
                                        current.isNew = false;
                                        current.isEditing = false;
                                    });
                            salesInvoiceApi.update(current.id, current)
                                .then(() => current.isEditing = false);
                        }
                    },
                    {
                        title: translate('Cancel'),
                        icon: 'fa fa-times',
                        canShow: current => current.isEditing,
                        action: current => {
                            if (current.isNew)
                                return gridOption.removeItem(current);

                            current.isEditing = false;
                            current.title = current.originalTitle;
                        }
                    }
                ],
                //readUrl: devConstants.urls.salesInvoce.all()
            };

        detailAccountApi.getAll().then(result=>{
            debugger;
            this.detailAccount = result.data}
        );
    }

}
