"use strict";

export  default class JournalTemplateController {
    constructor($scope, $state, journalTemplateApi, devConstants, logger, confirm, translate) {

        this.journalTempalteApi = journalTemplateApi;
        this.$scope = $scope;
        this.$state = $state;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;

        this.gridOption = {
            columns: [
                {
                    name: 'title',
                    title: translate('Title'),
                    type: 'string'
                }
            ],
            commands: [
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger',
                    action: current => this.remove(current)
                },
                {
                    title: translate('Run'),
                    icon: 'fa fa-clone text-success',
                    action: current => this.copy(current)
                }
            ],
            readUrl: devConstants.urls.journalTemplate.getAll(),
            gridSize: '300px'
        };
    }

    copy(template) {
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate('Create journal by journal template'))
            .then(() => this.journalTempalteApi.copy(template.id)
                .then(result => {
                    this.logger.success();
                    this.$state.go('^.edit', {id: result.id});
                    this.$scope.$close();
                }));
    }

    remove(template) {
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate('Remove current journal template'))
            .then(() => this.journalTempalteApi.remove(template.id)
                .then(() => {
                    this.logger.success();
                    this.gridOption.refresh();
                }));

    }

    close(){
        this.$scope.$dismiss();
    }
}