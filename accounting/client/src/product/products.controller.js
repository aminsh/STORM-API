"use strict";

export default class ProductController {
    constructor(productApi, translate, devConstants, logger, confirm,$timeout,$state) {
        this.productApi = productApi;
        this.logger = logger;
        this.$state=$state;
        this.gridOption = {
            columns: [
                {
                    name: 'code', title: translate('Code'), width: '10%',
                },
                {
                    name: 'title',
                    title: translate('Title'),
                    width: '70%',
                    template: `<a ui-sref=".edit({id: item.id})">{{item.title}}</a>`
                },
                {
                    name: 'productType',
                    title: translate('Type'),
                    width: '10%',
                    template: '{{item.productTypeDisplay}}'
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
                    title: translate('More Info'),
                    icon: 'fa fa-info-circle',
                    action: (current) => {
                        this.$state.go('.info',{id:current.id});
                    }
                }
            ],
            readUrl: devConstants.urls.products.getAll(),
            gridSize: '200px',
            selectable: true
        };
    }

    remove(id) {
        this.productApi.remove(id)
            .then(result => this.logger.success())
            .catch(errors => this.logger.error(errors));
    }

}