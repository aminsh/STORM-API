export default class peopleListController {
    constructor(translate,
                devConstants,
                logger,
                $timeout,
                peopleApi,
                confirm,
                $state,
                $scope,
                $rootScope,
                peopleImportFromExcelService) {

        this.$scope = $scope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.logger = logger;
        this.translate = translate;
        this.peopleApi = peopleApi;
        this.errors = [];
        this.peopleImportFromExcelService = peopleImportFromExcelService;

        let unRegister = $rootScope.$on('onPersonChanged', () => this.gridOption.refresh());

        $scope.$on('$destroy', unRegister);

        this.gridOption = {
            columns: [
                {
                    name: 'title', title: translate('Title'), width: '60%',
                    template: `<a ui-sref=".info({id: item.id})">{{item.title}}</a>`,
                    type: 'string',
                    /*css: 'text-center',
                    header:{
                        css:'text-center'
                    }*/
                },
                {
                    name: 'personTypeDisplay',
                    title: translate('Person Type'),
                    width: '20%',
                    type: 'string',
                     css: 'text-center'
                     /*header:{
                     css:'text-center'
                     }*/
                },
                {
                    name: 'phone',
                    title: translate('Phone'),
                    width: '20%',
                    type: 'string',
                    /*css: 'text-center',
                    header:{
                        css:'text-center'
                    }*/
                }
            ],
            commands: [
                {
                    title: translate('Remove'),
                    icon: 'fa fa-trash text-danger',
                    action: (current) => {
                        confirm(
                            translate('Are you sure ?'),
                            translate('Remove Person'))
                            .then(() => {
                                peopleApi.remove(current.id)
                                    .then(() => {
                                        logger.success();
                                        this.gridOption.refresh();
                                    })
                                    .catch((errors) => $scope.errors = errors);
                            });

                    }
                },
                {
                    title: translate('Edit'),
                    icon: 'fa fa-edit text-success',
                    action: (current) => {
                        this.$state.go('.edit', {id: current.id});
                    }
                }
            ],
            readUrl: devConstants.urls.people.getAll()
        };
    }

    importFormExcelFile(){
        this.peopleImportFromExcelService.show()
            .then(()=> this.gridOption.refresh());
    }
}
