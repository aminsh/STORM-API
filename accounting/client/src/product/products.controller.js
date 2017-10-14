"use strict";


export default class ProductController {
    constructor(
        $scope,
        $rootScope,
        productApi,
        translate,
        devConstants,
        logger,
        confirm,
        $timeout,
        $state,
        productImportFromExcelService) {

        this.productApi = productApi;
        this.productImportFromExcelService = productImportFromExcelService;
        this.logger = logger;
        this.$state = $state;
        this.gridOption = {
            columns: [
                {
                    name: 'referenceId', title: translate('Reference Code'), width: '20%',type: 'string'
                },
                {
                    name: 'title',
                    title: translate('Title'),
                    width: '70%',
                    type: 'string',
                    template: `<a ui-sref=".info({id: item.id})">{{item.title}}</a>`
                },
                {
                    name: 'productType',
                    title: translate('Type'),
                    width: '10%',
                    template: '{{item.productTypeDisplay}}',
                    type: 'productType'
                }
            ],
            commands: [
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger',
                    action: (current) => {
                        confirm(
                            translate('Remove Product'),
                            translate('Are you sure ?'))
                            .then(() => {
                                productApi.remove(current.id)
                                    .then(() => {
                                        logger.success();
                                        this.gridOption.refresh();
                                    })
                                    .catch((errors) => {
                                        $timeout(() => logger.error(errors.join('<br/>')), 100);
                                    });
                            });

                    }
                },
                {
                    title: translate('Edit'),
                    icon: 'fa fa-edit text-success',
                    action: (current) => {
                        if(this.$state.is('products'))
                            this.$state.go('.edit', {id: current.id});
                        if(this.$state.is('products.info'))
                            this.$state.go('^.edit', {id: current.id});
                    }
                }
            ],
            readUrl: devConstants.urls.products.getAll()
        };

        let unRegister = $rootScope.$on('onProductChanged', () => this.gridOption.refresh());

        $scope.$on('$destroy', unRegister);
    }

    remove(id) {
        this.productApi.remove(id)
            .then(result => this.logger.success())
            .catch(errors => this.logger.error(errors));
    }

    importFormExcelFile(){
        this.productImportFromExcelService.show()
            .then(()=> this.gridOption.refresh());
    }

}