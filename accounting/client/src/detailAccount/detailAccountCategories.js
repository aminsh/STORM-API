"use strict";

export default class DetailAccountCategoriesController {
    constructor(detailAccountCategoryApi, logger, translate, confirm, $timeout, devConstants, $state, $rootScope) {
        this.detailAccountCategoryApi = detailAccountCategoryApi;
        this.logger = logger;
        this.translate = translate;
        this.confirm = confirm;
        this.$timeout = $timeout;
        this.$state = $state;

        this.gridOption = {
            columns: [
                {
                    name: 'title',
                    title: translate('Title'),
                    width: '80%',
                    type: 'string'
                }
            ],
            commands: [
                {
                    title: this.translate('Remove'),
                    icon: 'fa fa-trash text-danger',
                    action: (current) => {
                        let translate = this.translate;

                        this.confirm(
                            translate('Are you sure ?'),
                            translate('Remove Detail account category'))
                            .then(() => {
                                this.detailAccountCategoryApi.remove(current.id)
                                    .then(() => {
                                        logger.success();
                                        this.gridOption.refresh();
                                    })
                                    .catch(errors => this.$timeout(() => logger.error(errors.join('<br/>')), 100));
                            });

                    }
                },
                {
                    title: this.translate('Edit'),
                    icon: 'fa fa-edit text-success',
                    action: current => {
                        this.$state.go('.edit', {id: current.id});
                    }
                }
            ],
            readUrl: devConstants.urls.detailAccountCategories.all()
        };


        $rootScope.$on('onDetailAccountCategoryChanged', () => this.gridOption.refresh());
    }


}